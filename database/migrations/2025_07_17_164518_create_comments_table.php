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
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->foreignId('post_id')->constrained()->on('posts')->onDelete('cascade');
            $table->text('body');
            $table->unsignedBigInteger('parent_id')->default(0)->index();
            $table->foreignId('organization_id')->references('id')->on('organizations');
            $table->index(['organization_id', 'post_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
