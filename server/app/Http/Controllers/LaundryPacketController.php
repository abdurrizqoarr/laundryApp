<?php

namespace App\Http\Controllers;

use App\Models\LaudryPacket;
use Illuminate\Http\Request;

class LaundryPacketController extends Controller
{
    public function index(Request $request)
    {
        // Ambil query parameter pencarian
        $search = $request->query('search');

        // Ambil data dari database dengan filter pencarian
        $query = LaudryPacket::query();

        if ($search) {
            $query->where('nama_paket', 'like', "%$search%");
        }

        $packets = $query->get();

        return response()->json([
            'message' => 'Success',
            'data' => $packets
        ], 200);
    }
}
