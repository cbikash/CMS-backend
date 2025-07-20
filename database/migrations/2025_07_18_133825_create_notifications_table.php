<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('name');
            $table->string('path')->nullable();
            $table->text('body')->nullable();
            $table->tinyInteger('status')->default(0)->comment('0: read, 1: unread, 3: completed');
            $table->tinyInteger('type')->default(0)->comment('0: message, 1: other');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
