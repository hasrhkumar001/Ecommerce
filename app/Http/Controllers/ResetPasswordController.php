<?php 

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class ResetPasswordController extends Controller
{
    public function reset(Request $request)
{
    $request->validate([
        'token' => 'required',     // This is the token we generated
        'email' => 'required|email',
        'password' => 'required|min:8|confirmed'
    ]);

    // Verify token matches what's in password_reset_tokens table
    $tokenData = \DB::table('password_reset_tokens')
        ->where('email', $request->email)
        ->where('token', $request->token)
        ->first();

    if (!$tokenData) {
        return response()->json(['message' => 'Invalid token'], 400);
    }

    // Update password if token is valid
    $user = User::where('email', $request->email)->first();
    $user->password = bcrypt($request->password);
    $user->save();

    // Delete the token as it's been used
    \DB::table('password_reset_tokens')
        ->where('email', $request->email)
        ->delete();

    return response()->json(['message' => 'Password reset successfully']);
}
}
