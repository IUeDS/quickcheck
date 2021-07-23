<?php

namespace App\Models\ResponseTypes;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentDragAndDropResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_response_id',
        'droppable_answer_id',
        'draggable_answer_id'
    ];
}
