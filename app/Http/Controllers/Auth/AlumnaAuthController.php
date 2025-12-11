<?php

namespace App\Http\Controllers\Auth;
use Inertia\Inertia; 
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Response;

class AlumnaAuthController extends Controller
{

    //assign role
    public function roles(): Response {
        $user_role = 'alumna';

        return Inertia::render('Auth/AlumnaSignup',[
            'initialRole' => $user_role
        ]);
    }


    //validate signup form
    public function signupAlumna(Request $request) {
        $validation = $request->validate([
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        //pass hashing shi
        $validation['password'] = Hash::make($validation['password']);
        unset($validation['password_confirmation']);

        //sets role to alumna
        $validation['user_role'] = 'alumna';

        //create user in da table
        $user = User::create($validation);

        //logs the user after sign up
        Auth::login($user);
        
        return redirect()->route('alumna.login')->with('success', 'Account created successfully!');
   }

   //render login page
    public function showLogin () {
        return Inertia::render('Auth/AlumnaLogin');
    }

    //login validation
    public function loginAlumna(Request $request) {
        $credentials = $request->validate([
            'email'=>'required|email',
            'password'=>'required|string',
        ]);

        //check if user is trying to login
        if(Auth::attempt($credentials)) {

            //check role if u alumna
            if(Auth::user()->user_role === 'alumna') {
                $request->session()->regenerate();
                return redirect()->route('alumna.home');
            }

            //if not alumna, logout agad
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            
            //error message lang
            throw ValidationException::withMessages([
                'email' => 'Access denied. You do not have alumna privileges.',
            ]);
        };

        throw ValidationException::withMessages([
            'credentials'=>'The username or password is incorrect.'
        ]);

    }

    public function logoutAlumna(Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('alumna.login');
    }


}
