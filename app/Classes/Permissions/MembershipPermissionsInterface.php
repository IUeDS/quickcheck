<?php

namespace App\Classes\Permissions;

interface MembershipPermissionsInterface {
    public function canUserWrite();
    public function canUserRead();
}