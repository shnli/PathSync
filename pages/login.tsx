import axios from 'axios';
import { useRouter } from "next/router";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'



export default function Login() {

    function newUser(){
    
        const emailField = document.getElementById("email") as HTMLInputElement
        const email = emailField.value
        const passwordField = document.getElementById("password") as HTMLInputElement
        const password = passwordField.value


        if (!email || !password){
            return
          }
      
        axios({
            method: 'post',
            url: '/api/auth/signup',
            data: {
                email: email,
                password: password
            }
        })
        .then(function (response) {
            console.log(response);
            localStorage.setItem("email", email); // Set the email in localStorage
            localStorage.setItem("password", password);      
                  
            router.push("/");
        })
        .catch(function (error) {
            setError("This user already exists, please log in."); 
            console.log(error);
        });
    }

    function getUser(){
        const emailField = document.getElementById("email") as HTMLInputElement
        const email = emailField.value
        const passwordField = document.getElementById("password") as HTMLInputElement
        const password = passwordField.value
        
        if (!email || !password) {
            return;
          }
      
        axios({
            method: 'post',
            url: '/api/auth/login',
            data: {
                email: email,
                password: password
            }
        })
        .then(function (response) {
            console.log(response);
            localStorage.setItem("email", email); // Set the email in localStorage
            localStorage.setItem("password", password);// Set the email in localStorage

            router.push({
                pathname: "/", // The path to your GraphPage component
            });
        })
        .catch(function (error) {
            if (error.response && error.response.status === 404) {
                setError("Incorrect password. Please try again.");}
            else if (error.response && error.response.status === 401){
                setError("User not found or Incorrect Password."); 
            }
            else {
                setError("An error occurred. Please try again later."); // Set generic error message
              }
            console.log(error);
        });
    }

    function localStorageTest(){
        console.log(localStorage.getItem('email'))
    }





    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [error, setError] = useState("");



  return (
    <div className='flex flex-col items-center justify-center h-screen md:bg-gray-100 '>
        <Link href="/welcome" className='absolute top-4 md:top-8 lg:top-10 left-4 md:left-12 flex-col justify-center items-center  hover:underline'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                </svg>
        </Link>
        
        <div className='md:rounded-xl md:shadow-md md:bg-white max-w-[600px]'>
            <div className='flex items-center justify-center text-center pt-12'>
                <Image
                    src="/login.svg"
                    alt="image"
                    width={200}
                    height={100}
                    className="rounded-lg"
                />
                <div className='flex justify-center font-bold text-xl text-primary-blue'>PathSync</div>
            </div>

        <div className="mx-auto w-full px-12 pt-8 pb-12">
            <div className='flex justify-center text-3xl font-bold text-gray-500 pb-4'>Welcome!</div>
            <div className='flex justify-center text-sm text-primary-blue pb-4 px-12 text-center font-bold '>Transform the way you manage and analyze collaborative processes today.</div>
            <div className='flex justify-center text-sm text-gray-400 pb-4 px-12 text-center text-xs'>To use PathSync, we ask you to create an account to save your work. Worry not, there are no strings attached and you will not receive any emails or notifications.</div>

            <div className="mx-auto max-w-md">
            <div className="pt-4">
                <label htmlFor="email" className="block mb-1 font-medium text-gray-500">
                Username
                </label>
                <input
                placeholder="EX: JohnDoe"
                id="email"
                type="text"
                className="text-gray-500 w-full px-8 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="pt-4">
                <label htmlFor="password" className="block mb-1 font-medium text-gray-500">
                Password
                </label>
                <input
                placeholder="EX: MyPassword123"
                id="password"
                type="password"
                className="text-gray-500 w-full px-8 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            </div>

            <div className='flex justify-center pt-12 gap-4'>
            <button onClick={getUser} className='px-16 py-2 border-2 border-primary-blue rounded-md text-primary-blue hover:shadow-none shadow-md'>Log in</button>
            <button onClick={newUser} className='px-16 py-2 rounded-md bg-primary-blue text-white hover:shadow-none shadow-md'>Sign Up</button>
            </div>

            {error && <div className="text-red-500 text-center mt-4">{error}</div>}

        </div>
      </div>
    </div>
  );
    
  
}
