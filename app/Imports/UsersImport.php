<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersImport
{
    public int $rowCount = 0;

    public function __construct(
        private readonly string $role = 'student'
    ) {}

    public function import(string $path): void
    {
        $file = fopen($path, 'r');
        if (!$file) {
            throw new \RuntimeException('Cannot open file.');
        }

        $headers = fgetcsv($file);
        if (!$headers) {
            fclose($file);
            throw new \RuntimeException('Empty CSV file.');
        }

        $headerMap = array_flip(array_map('trim', $headers));

        while (($row = fgetcsv($file)) !== false) {
            $data = [];
            foreach ($headerMap as $header => $index) {
                $data[$header] = $row[$index] ?? null;
            }

            $data['name'] = $data['name'] ?? throw new \RuntimeException('Missing name column.');
            $data['email'] = $data['email'] ?? throw new \RuntimeException('Missing email column.');

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password'] ?? 'password123'),
                'nisn' => $data['nisn'] ?? null,
                'class' => $data['class'] ?? null,
                'major' => $data['major'] ?? null,
            ]);

            $user->assignRole($this->role);
            $this->rowCount++;
        }

        fclose($file);
    }
}
