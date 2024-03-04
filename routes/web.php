<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/warband/{id}', function ($id) {
    $warband = \App\Models\Warband::firstOrNew([
        'id' => $id,
    ]);
    $warband->load('warriors');
    $warband->warriors->each->load('equipments');
    foreach ($warband->warriors as $warrior) {
        $warrior->equipments->each->load('rules');
    }
    $warriorTemplates = \App\Models\WarriorTemplate::all();
    $warriorTemplates->each->load('rules');
    return Inertia::render('Warband/Create', [
        'warband' => $warband,
        'warbandTypes' => \App\Models\Warband::TYPES,
        'warriorTemplates' => $warriorTemplates,
        'equipments' => \App\Models\Equipment::all(),
    ]);
});

Route::post('/warband', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'type' => ['required', 'string', 'max:255'],
        'warriors' => ['required', 'array'],
    ]);
    $warband = \App\Models\Warband::firstOrNew([
        'id' => $request->input('id'),
    ]);
    $warband->fill($request->all());
    if (!$warband->save()) {
        return response()->json(['message' => 'Failed to persist warband'], 500);
    }
    $warriorIds = [];
    foreach ($request->get('warriors') as $warriorRequest) {
        if (!empty($warriorRequest['id'])) {
            $warrior = \App\Models\Warrior::findOrFail($warriorRequest['id']);
        } else {
            $warrior = new \App\Models\Warrior();
        }
        $warrior->fill($warriorRequest);
        $warrior->warband_id = $warband->id;
        if (!$warrior->save()) {
            return response()->json(['message' => 'Failed to persist warrior'], 500);
        }
        $warriorIds[] = $warrior->id;
        $warrior->equipments()->sync(array_map(function ($equipment) {
            return $equipment['id'];
        }, $warriorRequest['equipments']));
    }
    \App\Models\Warrior::where('warband_id', $warband->id)
        ->whereNotIn('id', $warriorIds)
        ->delete();
    return response()->json($warband);
});

Route::get('/warriors', function () {
    return response()->json(\App\Models\Warrior::all());
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
