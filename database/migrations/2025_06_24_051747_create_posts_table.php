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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('body');
            $table->string('image')->nullable();
            $table->enum('status', ['published', 'draft', 'create.tsx'])->default('create.tsx');
            $table->text('keywords')->nullable();
            $table->text('seo')->nullable();
            $table->dateTime('published_at')->nullable();
            $table->foreignId('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreignId('updated_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreignId('published_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreignId('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->string('custom_field1')->nullable();
            $table->string('custom_field2')->nullable();
            $table->string('custom_field3')->nullable();
            $table->text('custom_field4')->nullable();
            $table->foreignId('menu_id')->references('id')->on('menus')->onDelete('cascade');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
