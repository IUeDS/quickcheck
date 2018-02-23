<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model as Eloquent;

class Feature extends Eloquent {
    protected $table = 'features';
    protected $fillable = [
        'name',
        'description',
        'default_state',
        'admin_only'
    ];

    public function collectionFeatures() {
        return $this->hasMany('App\Models\CollectionFeature');
    }
}