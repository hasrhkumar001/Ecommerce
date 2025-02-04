<?php

namespace App\Http\Controllers;

use Google\Client as GoogleClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('API Token')->plainTextToken;

        return response()->json(['token' => $token], 200);
    }

    public function register(Request $request){
       // Define validation rules
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'address' => 'required|string|max:255',
            'phoneNo' => 'required|string|min:10|max:15',
            'password' => 'required|string|min:6',
        ]);

        // Handle validation failure
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

    // Get validated data
    $validatedData = $validator->validated();
    
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'address' => $validatedData['address'],
            'phone' => $validatedData['phoneNo'],
            'password' => bcrypt($validatedData['password'])
        ]);
    
        return response()->json([
            'message' => 'User successfully registered.'
            
        ]);
    
    }

    public function handleGoogleLogin(Request $request)
    {
        $client = new GoogleClient(['client_id' => env('177821530322-qir0bd588g2ku5dcmp7t7hcja6jecea1.apps.googleusercontent.com')]);
        $payload = $client->verifyIdToken($request->token);
       

        if (!$payload) {
            return response()->json(['error' => 'Invalid Google token'], 401);
        }

        $user = User::firstOrCreate(
            ['email' => $payload['email']],
            [
                'name' => $payload['name'],
                'password' => bcrypt(Str::random(8)), // Generate a random password
                'address' => '',
                'phone' =>'',
            ]
        );

        $token = $user->createToken('API Token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully'], 200);
    }
}
