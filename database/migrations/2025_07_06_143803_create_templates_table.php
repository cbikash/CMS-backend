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
        Schema::create('templates', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('image')->nullable();
            $table->enum('status', ['0', '1'])->default('0')->comment('0: inactive, 1: active');
            $table->boolean('is_default')->default(false);
            $table->foreignId('organization_id')->references('id')->on('organizations');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('templates');
    }
};
