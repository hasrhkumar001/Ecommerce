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
        Schema::table('order_details', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
            $table->dropForeign(['product_id']);
            $table->softDeletes();
           
            // Add the foreign key back without cascading
            $table->foreign('order_id')
                ->references('id')
                ->on('orders')->onDelete('cascade');;
            // Add the foreign key back without cascading
            $table->foreign('product_id')
            ->references('id')
            ->on('products')->onDelete('cascade');;

               
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_details', function (Blueprint $table) {
            //
        });
    }
};
