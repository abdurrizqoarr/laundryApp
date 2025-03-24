<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiwayatTransaksi extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'riwayat_transaksi';
    protected $primaryKey = 'id';

    protected $fillable = [
        'jenis_transaksi',
        'keterangan',
        'nilai_transaksi',
        'total_berat',
        'status',
        'estimasi_selesai'
    ];
}
