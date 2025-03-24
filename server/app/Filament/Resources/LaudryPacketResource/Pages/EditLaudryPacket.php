<?php

namespace App\Filament\Resources\LaudryPacketResource\Pages;

use App\Filament\Resources\LaudryPacketResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditLaudryPacket extends EditRecord
{
    protected static string $resource = LaudryPacketResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
            Actions\ForceDeleteAction::make(),
            Actions\RestoreAction::make(),
        ];
    }
}
