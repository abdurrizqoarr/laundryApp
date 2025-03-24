<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'orders';
    protected $primaryKey = 'id';

    protected $fillable = [
        'customer_id',
        'packet_id',
        'total_harga',
        'total_berat',
        'status',
        'estimasi_selesai'
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function laundryPacket(): BelongsTo
    {
        return $this->belongsTo(LaudryPacket::class, 'packet_id');
    }
}
