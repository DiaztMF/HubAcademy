<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Category;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\Course;
use App\Models\ForumComment;
use App\Models\ForumPost;
use App\Models\Logbook;
use App\Models\News;
use App\Models\Portfolio;
use App\Models\Section;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SampleDataSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin HubAcademy',
            'email' => 'admin@hubacademy.test',
            'password' => Hash::make('password'),
            'nisn' => '0000000001',
            'class' => null,
            'major' => null,
        ]);
        $admin->assignRole('admin');

        $teacher1 = User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@hubacademy.test',
            'password' => Hash::make('password'),
            'nisn' => '0000000011',
            'class' => null,
            'major' => 'IPA',
        ]);
        $teacher1->assignRole('teacher');

        $teacher2 = User::create([
            'name' => 'Siti Rahmawati',
            'email' => 'siti@hubacademy.test',
            'password' => Hash::make('password'),
            'nisn' => '0000000012',
            'class' => null,
            'major' => 'IPS',
        ]);
        $teacher2->assignRole('teacher');

        $mentor = User::create([
            'name' => 'Ahmad Rizki',
            'email' => 'ahmad.rizki@techcorp.test',
            'password' => Hash::make('password'),
            'nisn' => '0000000021',
            'class' => null,
            'major' => null,
        ]);
        $mentor->assignRole('industry-mentor');

        $studentsData = [
            ['Andi Pratama', '1000000001', 'X-A', 'IPA'],
            ['Bunga Citra', '1000000002', 'X-A', 'IPA'],
            ['Cahyo Nugroho', '1000000003', 'XI-B', 'IPS'],
            ['Dewi Lestari', '1000000004', 'XI-B', 'IPS'],
            ['Eko Prasetyo', '1000000005', 'XII-A', 'IPA'],
        ];

        $students = [];
        foreach ($studentsData as [$name, $nisn, $class, $major]) {
            $email = strtolower(str_replace(' ', '.', $name)) . '@hubacademy.test';
            $student = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make('password'),
                'nisn' => $nisn,
                'class' => $class,
                'major' => $major,
                'mentor_id' => $mentor->id,
            ]);
            $student->assignRole('student');
            $students[] = $student;
        }

        $course1 = Course::create(['title' => 'Matematika Dasar', 'description' => 'Belajar konsep dasar matematika meliputi aljabar, geometri, dan trigonometri untuk siswa SMA.', 'teacher_id' => $teacher1->id]);
        $course2 = Course::create(['title' => 'Bahasa Indonesia', 'description' => 'Meningkatkan kemampuan berbahasa Indonesia yang baik dan benar, mencakup tata bahasa, menulis, dan membaca.', 'teacher_id' => $teacher2->id]);
        $course3 = Course::create(['title' => 'Pemrograman Web', 'description' => 'Pengenalan pemrograman web modern dengan HTML, CSS, JavaScript, dan framework Laravel.', 'teacher_id' => $teacher1->id]);

        $section1a = Section::create(['course_id' => $course1->id, 'title' => 'Aljabar', 'order' => 1]);
        $section1b = Section::create(['course_id' => $course1->id, 'title' => 'Geometri', 'order' => 2]);
        $section2a = Section::create(['course_id' => $course2->id, 'title' => 'Tata Bahasa', 'order' => 1]);
        $section2b = Section::create(['course_id' => $course2->id, 'title' => 'Menulis Kreatif', 'order' => 2]);
        $section3a = Section::create(['course_id' => $course3->id, 'title' => 'HTML & CSS', 'order' => 1]);
        $section3b = Section::create(['course_id' => $course3->id, 'title' => 'JavaScript', 'order' => 2]);

        Topic::create(['section_id' => $section1a->id, 'title' => 'Persamaan Linear', 'content_markdown' => '# Persamaan Linear

Persamaan linear adalah persamaan yang pangkat tertinggi variabelnya adalah satu.

## Bentuk Umum

$$ ax + b = 0 $$

dimana $a \neq 0$.

## Contoh Soal

Selesaikan $2x + 5 = 13$.

**Penyelesaian:**

$$ 2x + 5 = 13 $$
$$ 2x = 8 $$
$$ x = 4 $$
', 'order' => 1]);
        Topic::create(['section_id' => $section1a->id, 'title' => 'Fungsi Kuadrat', 'content_markdown' => '# Fungsi Kuadrat

Fungsi kuadrat memiliki bentuk umum $f(x) = ax^2 + bx + c$ dengan $a \neq 0$.
', 'order' => 2]);
        Topic::create(['section_id' => $section1b->id, 'title' => 'Teorema Pythagoras', 'content_markdown' => '# Teorema Pythagoras

Pada segitiga siku-siku, kuadrat sisi miring sama dengan jumlah kuadrat sisi-sisi lainnya.
', 'order' => 1]);

        Topic::create(['section_id' => $section2a->id, 'title' => 'Struktur Kalimat', 'content_markdown' => '# Struktur Kalimat

Kalimat dalam bahasa Indonesia terdiri dari Subjek (S), Predikat (P), Objek (O), dan Keterangan (K).
', 'order' => 1]);
        Topic::create(['section_id' => $section2a->id, 'title' => 'Penggunaan EYD', 'content_markdown' => '# Pedoman Umum Ejaan Bahasa Indonesia

EYD edisi V mulai berlaku sejak tahun 2022.
', 'order' => 2]);
        Topic::create(['section_id' => $section2b->id, 'title' => 'Menulis Cerpen', 'content_markdown' => '# Menulis Cerita Pendek

Langkah-langkah menulis cerpen: tentukan tema, buat karakter, susun alur, dan tulis dengan gaya bahasa yang menarik.
', 'order' => 1]);

        Topic::create(['section_id' => $section3a->id, 'title' => 'Pengenalan HTML', 'content_markdown' => '# HTML Dasar

HTML (HyperText Markup Language) adalah bahasa markup untuk membuat struktur halaman web.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Judul Halaman</title>
</head>
<body>
    <h1>Hello World!</h1>
</body>
</html>
```
', 'order' => 1]);
        Topic::create(['section_id' => $section3a->id, 'title' => 'CSS Flexbox', 'content_markdown' => '# CSS Flexbox

Flexbox adalah model layout satu dimensi yang memudahkan pengaturan elemen dalam container.
', 'embed_link' => 'https://www.youtube.com/embed/JJSoEo8O5jI', 'order' => 2]);
        Topic::create(['section_id' => $section3b->id, 'title' => 'Variabel dan Tipe Data', 'content_markdown' => '# JavaScript: Variabel

```javascript
let nama = "Andi";
const umur = 17;
var kelas = "X IPA";
```
', 'order' => 1]);

        $course1->students()->attach([$students[0]->id, $students[1]->id, $students[4]->id]);
        $course2->students()->attach([$students[2]->id, $students[3]->id]);
        $course3->students()->attach([$students[0]->id, $students[1]->id, $students[2]->id, $students[3]->id, $students[4]->id]);

        $dates = [
            now()->subDays(4),
            now()->subDays(3),
            now()->subDays(2),
            now()->subDays(1),
        ];

        foreach ($dates as $date) {
            foreach ($course1->students as $student) {
                Attendance::create([
                    'course_id' => $course1->id,
                    'student_id' => $student->id,
                    'teacher_id' => $teacher1->id,
                    'date' => $date,
                    'status' => fake()->randomElement(['present', 'present', 'present', 'late', 'sick', 'absent']),
                    'notes' => null,
                ]);
            }
            foreach ($course2->students as $student) {
                Attendance::create([
                    'course_id' => $course2->id,
                    'student_id' => $student->id,
                    'teacher_id' => $teacher2->id,
                    'date' => $date,
                    'status' => fake()->randomElement(['present', 'present', 'present', 'late', 'sick', 'absent']),
                    'notes' => null,
                ]);
            }
        }

        Portfolio::create(['user_id' => $students[0]->id, 'title' => 'Website Sekolah', 'description' => 'Membangun website profil sekolah menggunakan HTML, CSS, dan JavaScript.', 'category' => 'Web Development', 'external_link' => 'https://andi-portfolio.test/school-web']);
        Portfolio::create(['user_id' => $students[0]->id, 'title' => 'Aplikasi Kalkulator', 'description' => 'Kalkulator sederhana dengan fitur operasi dasar matematika berbasis JavaScript.', 'category' => 'Application', 'external_link' => null]);
        Portfolio::create(['user_id' => $students[1]->id, 'title' => 'Poster Digital', 'description' => 'Poster digital untuk kampanye kebersihan lingkungan sekolah.', 'category' => 'Design', 'external_link' => 'https://bunga-portfolio.test/poster']);
        Portfolio::create(['user_id' => $students[2]->id, 'title' => 'Essay Kebangsaan', 'description' => 'Essay tentang peran generasi muda dalam mempertahankan nilai-nilai Pancasila.', 'category' => 'Writing', 'external_link' => null]);
        Portfolio::create(['user_id' => $students[4]->id, 'title' => 'IoT Sederhana', 'description' => 'Proyek sensor suhu berbasis Arduino untuk monitoring ruangan.', 'category' => 'Hardware', 'external_link' => 'https://eko-portfolio.test/iot']);

        Logbook::create(['student_id' => $students[0]->id, 'date' => now()->subDays(4), 'summary' => 'Mempelajari dasar-dasar HTML: tag, elemen, dan atribut.', 'teacher_id' => $teacher1->id, 'mentor_id' => $mentor->id, 'verified_at' => now()->subDays(3), 'feedback' => 'Bagus, lanjutkan ke materi CSS']);
        Logbook::create(['student_id' => $students[0]->id, 'date' => now()->subDays(3), 'summary' => 'Praktik membuat form login dengan HTML dan CSS.', 'teacher_id' => $teacher1->id, 'verified_at' => now()->subDays(2), 'feedback' => 'Perhatikan validasi form']);
        Logbook::create(['student_id' => $students[1]->id, 'date' => now()->subDays(4), 'summary' => 'Belajar persamaan linear dan fungsi kuadrat.', 'teacher_id' => $teacher1->id, 'verified_at' => now()->subDays(2), 'feedback' => null]);
        Logbook::create(['student_id' => $students[1]->id, 'date' => now()->subDays(2), 'summary' => 'Mengerjakan soal-soal trigonometri dasar.', 'teacher_id' => $teacher1->id, 'verified_at' => null, 'feedback' => null]);
        Logbook::create(['student_id' => $students[2]->id, 'date' => now()->subDays(3), 'summary' => 'Membuat makalah tentang struktur kalimat dalam bahasa Indonesia.', 'teacher_id' => $teacher2->id, 'verified_at' => now()->subDays(1), 'feedback' => 'Perhatikan penggunaan EYD']);
        Logbook::create(['student_id' => $students[2]->id, 'date' => now()->subDays(1), 'summary' => 'Menulis cerpen bertema persahabatan.', 'teacher_id' => $teacher2->id, 'mentor_id' => $mentor->id, 'verified_at' => now(), 'feedback' => 'Cerita yang menarik!']);

        $generalCat = Category::where('slug', 'general')->first();
        $announceCat = Category::where('slug', 'internal-announcements')->first();

        $post1 = ForumPost::create(['user_id' => $students[0]->id, 'category_id' => $generalCat->id, 'title' => 'Tips belajar pemrograman untuk pemula?', 'content' => 'Halo teman-teman, aku baru mulai belajar pemrograman web. Ada tips untuk pemula seperti aku? Mohon sarannya dari kakak kelas.']);
        $post2 = ForumPost::create(['user_id' => $teacher1->id, 'category_id' => $announceCat->id, 'title' => 'Jadwal UTS Semester Genap 2026', 'content' => 'Diumumkan kepada seluruh siswa bahwa UTS Semester Genap akan dilaksanakan pada tanggal 20-25 Juli 2026. Silakan persiapkan diri dengan baik.']);
        $post3 = ForumPost::create(['user_id' => $students[3]->id, 'category_id' => $generalCat->id, 'title' => 'Rekomendasi buku matematika', 'content' => 'Ada yang punya rekomendasi buku matematika yang mudah dipahami untuk persiapan UTS?']);

        ForumComment::create(['post_id' => $post1->id, 'user_id' => $students[4]->id, 'content' => 'Mulai dari HTML dulu, lalu CSS, baru JavaScript. Pelan-pelan aja, jangan terburu-buru.']);
        ForumComment::create(['post_id' => $post1->id, 'user_id' => $teacher1->id, 'content' => 'Setuju. Saya juga sarankan untuk banyak praktik langsung, bukan hanya baca teori.']);
        ForumComment::create(['post_id' => $post1->id, 'user_id' => $students[0]->id, 'content' => 'Terima kasih sarannya, kak!']);
        ForumComment::create(['post_id' => $post3->id, 'user_id' => $students[0]->id, 'content' => 'Coba cek buku "Matematika SMA Kelas X" dari Kemendikbud, lumayan lengkap.']);

        $conv = ChatConversation::create();
        $conv->participants()->attach([$students[0]->id, $students[1]->id]);
        ChatMessage::create(['conversation_id' => $conv->id, 'user_id' => $students[0]->id, 'content' => 'Hai, apa kabar?']);
        ChatMessage::create(['conversation_id' => $conv->id, 'user_id' => $students[1]->id, 'content' => 'Baik. Lagi ngapain?']);
        ChatMessage::create(['conversation_id' => $conv->id, 'user_id' => $students[0]->id, 'content' => 'Lagi ngerjain tugas logbook. Kamu udah?']);
        ChatMessage::create(['conversation_id' => $conv->id, 'user_id' => $students[1]->id, 'content' => 'Udah, kemarin aku kumpul.']);

        $conv2 = ChatConversation::create();
        $conv2->participants()->attach([$students[0]->id, $teacher1->id]);
        ChatMessage::create(['conversation_id' => $conv2->id, 'user_id' => $teacher1->id, 'content' => 'Andi, tugas pemrograman webnya sudah dikerjakan?']);
        ChatMessage::create(['conversation_id' => $conv2->id, 'user_id' => $students[0]->id, 'content' => 'Sudah Pak, tinggal beberapa revisi.']);
        ChatMessage::create(['conversation_id' => $conv2->id, 'user_id' => $teacher1->id, 'content' => 'Baik, kumpulkan minggu ini ya.']);

        News::create(['user_id' => $teacher1->id, 'title' => 'Prestasi Siswa di Olimpiade Matematika', 'content' => 'Selamat kepada tim olimpiade matematika SMA HubAcademy yang berhasil meraih medali perak di Olimpiade Sains Nasional tingkat provinsi.', 'is_published' => true]);
        News::create(['user_id' => $admin->id, 'title' => 'Penerimaan Siswa Baru Tahun Ajaran 2026/2027', 'content' => 'Pendaftaran siswa baru untuk tahun ajaran 2026/2027 telah dibuka. Silakan kunjungi website resmi untuk informasi lebih lanjut.', 'is_published' => true]);
        News::create(['user_id' => $teacher2->id, 'title' => 'Workshop Jurnalistik untuk Siswa', 'content' => 'Dalam rangka mengembangkan bakat menulis siswa, akan diadakan workshop jurnalistik pada tanggal 10 Agustus 2026. Narasumber dari praktisi media nasional.', 'is_published' => true]);
        News::create(['user_id' => $admin->id, 'title' => 'Libur Hari Raya', 'content' => 'Diumumkan bahwa kegiatan belajar mengajar diliburkan pada tanggal 1-3 Juli 2026.', 'is_published' => false]);
    }
}
