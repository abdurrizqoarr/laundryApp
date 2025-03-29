<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\LaudryPacket;
use App\Models\Order;
use App\Models\RiwayatTransaksi;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $orders = Order::with(['customer', 'laundryPacket'])
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            return response()->json([
                'message' => 'success',
                'data' => $orders->items(), // Mengambil hanya daftar data, bukan semua metadata pagination
                'pagination' => [
                    'current_page' => $orders->currentPage(),
                    'per_page' => $orders->perPage(),
                    'total' => $orders->total(),
                    'last_page' => $orders->lastPage(),
                ]
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Terjadi kesalahan pada server',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $data = Order::with(['customer', 'laundryPacket'])
                ->findOrFail($id);

            return response()->json([
                'message' => 'Success',
                'data' => $data
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Data not found',
                'data' => null
            ], 404);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage(),
                'data' => null
            ], 500);
        }
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_id'   => 'sometimes|exists:customers,id',
            'packet_id'     => 'required|exists:laudry_packets,id',
            'total_berat'   => 'required|numeric|min:1',
            'nama_customer' => 'sometimes|required_without:customer_id|string|max:120',
            'nomer_hp'      => 'sometimes|required_without:customer_id|string|max:20',
            'alamat'        => 'sometimes|string',
            'estimasi_selesai' => 'required|date|after_or_equal:today',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        DB::beginTransaction();
        try {
            if ($request->filled('customer_id')) {
                $customer = Customer::find($request->customer_id);

                if (!$customer) {
                    return response()->json([
                        'message' => 'Customer not found',
                        'data' => null
                    ], Response::HTTP_NOT_FOUND);
                }
            } else {
                // Buat customer baru jika customer_id tidak diberikan
                $customer = Customer::create([
                    'nama_customer'  => $request->nama_customer,
                    'nomer_hp' => $request->nomer_hp,
                    'alamat' => $request->alamat
                ]);
            }

            $paket = LaudryPacket::findOrFail($request->packet_id);

            $totalHarga = $request->total_berat * $paket->harga;

            $order = Order::create([
                'customer_id' => $customer->id,
                'packet_id'   => $request->packet_id,
                'total_harga' => $totalHarga,
                'total_berat' => $request->total_berat,
                'estimasi_selesai' => $request->estimasi_selesai,
            ]);

            RiwayatTransaksi::create([
                'jenis_transaksi' => 'masuk',
                'keterangan' => 'pemasukan laundry',
                'nilai_transaksi' => $totalHarga,
            ]);

            DB::commit();
            return response()->json([
                'message' => 'success',
                'data' => $order
            ], Response::HTTP_CREATED);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'message' => $th->getMessage(),
                'data' => null
            ], 500);
        }
    }

    public function updateStatus(Request $request, string $id)
    {
        // Validasi input untuk memastikan hanya menerima status "selesai" atau "batal"
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:selesai,batal',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $order = Order::findOrFail($id);

            // Cek apakah status sudah "selesai" atau "batal", jika iya tidak bisa diubah lagi
            if (in_array($order->status, ['selesai', 'batal'])) {
                return response()->json([
                    'message' => 'Status order sudah tidak dapat diubah',
                    'data' => $order
                ], Response::HTTP_FORBIDDEN);
            }

            // Update status
            $order->update(['status' => $request->status]);

            return response()->json([
                'message' => 'Status order berhasil diperbarui',
                'data' => $order
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'data' => null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
