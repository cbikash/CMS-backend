<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DefaultPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'list post',
            'create post',
            'edit post',
            'delete post',
            'view post',
            'publish post',

            'list user',
            'create user',
            'edit user',
            'delete user',

            'list role',
            'create role',
            'edit role',
            'delete role',

            'list faq',
            'create faq',
            'edit faq',
            'delete faq',

            'list contact',
            'create contact',
            'edit contact',
            'delete contact',

            'list menu',
            'create menu',
            'edit menu',
            'delete menu',

            'create setting',
            'edit setting',

            'list message',
            'view message',

            'list subscription',
            'view subscription',

            'create testimonial',
            'edit testimonial',
            'delete testimonial',
            'list testimonial',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Optionally, create roles and assign permissions
        $adminRole = Role::firstOrCreate(['name' => 'super-admin']);

        // Assign all permissions to admin
        $adminRole->syncPermissions(Permission::all());
    }
}
