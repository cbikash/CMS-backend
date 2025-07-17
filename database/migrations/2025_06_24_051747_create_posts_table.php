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
            $table->longText('body')->nullable();
            $table->string('image')->nullable();
            $table->text('description')->nullable();

            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('meta_keywords')->nullable();
            $table->boolean('enabled_comment')->default(true);

            $table->enum('status', ['published', 'draft', 'create'])->default('create');
            $table->text('keywords')->nullable();
            $table->text('seo')->nullable();

            $table->dateTime('published_at')->nullable();
            $table->foreignId('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreignId('updated_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreignId('published_by')->nullable()->references('id')->on('users')->onDelete('cascade');
            $table->foreignId('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->string('custom_field1')->nullable();
            $table->string('custom_field2')->nullable();
            $table->string('custom_field3')->nullable();
            $table->text('custom_field4')->nullable();
            $table->foreignId('menu_id')->nullable()
                ->references('id')->on('menus')->onDelete('cascade');
            $table->foreignId('category_id')->nullable()
                ->references('id')->on('categories');
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
