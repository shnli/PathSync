import WelcomeNavbar from "@/components/Navbar/welcomeNavbar"

import Link from "next/link"
export default function Welcome(){
    return(
        <div>
            <WelcomeNavbar></WelcomeNavbar>
            <div  className="flex flex-col justify-center items-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#222b6e] to-[#49305c] min-h-screen">
                <div id="top" className="pt-8 flex justify-between items-center px-36 gap-24 items-center min-h-screen">
                    <div className="flex flex-col w-1/2 items-start justify-center gap-8">
                        <div className="text-white text-[60px] font-bold ">
                            Project Tracking Has Never Been So <span className="linear-wipe1">Transparent.</span>
                        </div>
                        <div className="flex gap-4">
                            <Link href = "/#about">
                                <div className="flex justify-center text-white text-[15px] hover:bg-white hover:bg-opacity-20 opacity-90 border-white px-8 py-4 rounded-lg border-[1px] font-bold gap-4">
                                    <div>
                                    ABOUT PATHSYNC</div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                                    </svg>

                                </div>
                            </Link>
                            <Link href = "/login">
                                <div className="flex justify-center text-[#222b6e] hover:bg-opacity-80 text-[15px] bg-opacity-70 border-opacity-70 border-white bg-white px-16 py-4 rounded-lg border-[1px] font-bold">
                                    Get Started
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="flex justify-center items-center w-1/2 pt-12">
                        <img src="/pathsync.png"></img>
                    </div>
                </div>

            <div id="about" className="pb-48 flex flex-col gap-8 px-36">
                <div className=" flex flex-col text-white justify-center align center text-[20px]">
                    <div className="text-center flex flex-col gap-4 bg-[#7d4ba3] bg-opacity-20 shadow-md px-36 py-12 rounded-xl  gap-8 opacity-90">
                        <div className="text-[30px] font-bold">
                        What is PathSync? 
                        </div>
                        <div>
                        PathSync is a web application designed to facilitate easy and effective project tracking between individuals and organizations working together on highly iterative and task oriented projects. By integrating project management and analysis functionalities, the program brings transparency to the entire collaborative process.
                        </div>
                        <div className="flex justify-center">
                            <Link href="https://lishen.app/projects/PathSync" className="flex border-[1px] rounded-full max-w-[300px] px-8 py-4 justify-center items-center">
                                Read More
                            </Link>
                        </div>
                    </div>
                    
                </div>

                <div className="flex justify-between items-center gap-8 text-white text-[20px]">
                    <div className="text-center flex flex-col gap-4 bg-[#7d4ba3] bg-opacity-20 shadow-md px-12 py-12 rounded-xl w-1/2 h-[600px]">
                        <div className="flex flex-col gap-4 text-start opacity-90">
                            <div className="flex gap-4 justify-center items-center">
                                <div className="font-bold text-[30px]">
                                    Key Features
                                </div>
                                <img src="/spark.png" className= "w-10 h-10"></img>
                            </div>
                            <div id="about">
                                <ul className='flex flex-col list-disc pl-8 gap-2'>
                                    <li>Project Saving and Tracking</li>
                                    <li>Expected Start & End vs. Actual Start & End</li>
                                    <li>Project Completion Percentage</li>
                                    <li>Actual Task Duration Calculation</li>
                                    <li>Start Dates Delay (Schedule Slippage) Calculation</li>
                                    <li>Duration Delay (Duration Slippage) Calculation</li>
                                    <li>Project Completion Percentage</li>
                                    <li>Easy and Clean UI</li>


                                </ul>
                            </div>
                        </div>
                    </div>

                    
                    <div className="text-center flex flex-col gap-4 bg-[#7d4ba3] bg-opacity-20 shadow-md px-12 py-12 rounded-xl w-1/2 h-[600px]">
                        
                        <div className="flex flex-col gap-4 text-start">
                            <div className="flex gap-4 justify-center items-center">
                                <div className="font-bold text-[30px] linear-wipe1">
                                    Recent Updates
                                </div>
                                <img src="/sparkle.png" className= "w-10 h-10"></img>
                            </div>
                            <div>
                                <ul className='flex flex-col list-disc pl-8 gap-2 linear-wipe1'>
                                    <div> →  Upcoming Tasks</div>
                                    <div> →  Project Deletion</div>
                                </ul>
                            </div>
                        </div>
                     </div>

                     <div className="text-center flex flex-col gap-4 bg-[#7d4ba3] bg-opacity-20 shadow-md px-12 py-12 rounded-xl w-1/2 h-[600px]">
                        
                        <div className="flex flex-col gap-4 text-start">
                            <div className="flex gap-4 justify-center items-center">
                                <div className="font-bold text-[30px] linear-wipe1">
                                    Next Updates
                                </div>
                                <img src="/next.png" className= "w-10 h-10"></img>
                            </div>
                            <div>
                                <ul className='flex flex-col list-disc pl-8 gap-2 linear-wipe1'>
                                    <div> →  Project Copy and Duplication</div>
                                    <div> →  Edit Project Title Information</div>
                                    <div> →  Mobile Compatibility</div>
                                    <div> →  Linked User Accounts</div>
                                    <div> →  Faster Loading Time</div>
                                    <div> →  Exporting to Excel</div>
                                </ul>
                            </div>
                        </div>
                    
                     </div>

                    </div>
                </div>

            </div>
        </div>
    )
}