<?php

namespace App\Filament\Resources\LaudryPacketResource\Pages;

use App\Filament\Resources\LaudryPacketResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListLaudryPackets extends ListRecords
{
    protected static string $resource = LaudryPacketResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
