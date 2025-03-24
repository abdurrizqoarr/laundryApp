<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LaudryPacket extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'laudry_packets';
    protected $primaryKey = 'id';

    protected $fillable = [
        'nama_paket',
        'harga',
    ];
}
