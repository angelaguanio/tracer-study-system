<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoordinatorAlumni extends Model
{
    protected $table = 'coordinator_alumni';
    protected $fillable = ['name', 'course', 'year'];
}