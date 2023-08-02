import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import Navbar from '../components/Navbar/Navbar';
import React from 'react';
import { Task as PrismaTask } from '@prisma/client';


type Task = PrismaTask & {
    scheduleSlippage: number;
    durationSlippage: number;

  };

export default function MyTrackerSubpage()  {
    
    const router = useRouter();
    const { id, purchaseOrderCode, productModel, orderDate, orderQuantity, projectStartDate } = router.query;
    const projectId = Number(id); 
    const [selectedRow, setSelectedRow] = useState<number | null>(null);

    const handleRowClick = (index: number) => {
        if (selectedRow === index) {
            setSelectedRow(null);
        } else {
            setSelectedRow(index);
        }
      };

    const [tasks, setTasks] = useState<{
        id: number;
        
        step: number,
        startCheck: boolean,
        finishCheck: boolean,
        
        task: string,
        lead: string,
        duration:string,
        expectedStart:string,
        expectedFinish:string,
        start:string,
        finish:string,
        remarks:string,
        executingSide:string,
        projectId: number,

        actualDuration: number,
        scheduleSlippage: number,
        durationSlippage: number

      }[]>([]);


    const [outputStatus, setOutputStatus] = useState<string>('');

    const calculateAverageScheduleSlippage = (tasks: Task[], executingSide: string) => {
        const filteredTasks = tasks.filter(task => task.executingSide === executingSide);
        const totalSlippage = filteredTasks.reduce((total, task) => {
            if(!isNaN(task.scheduleSlippage)){
                return total + task.scheduleSlippage
            }
            else{
                return total;
            }
        }, 0);

        const nonNaNCount = filteredTasks.filter(task => !isNaN(task.scheduleSlippage)).length;
        const averageSlippage = nonNaNCount > 0 ? totalSlippage / nonNaNCount : 0;
        const averageSlippageRounded = averageSlippage.toFixed(2); 
      
        return parseFloat(averageSlippageRounded);    
    };

    const calculateAverageDurationSlippage = (tasks: Task[], executingSide: string) => {
        const filteredTasks = tasks.filter(task => task.executingSide === executingSide);
        const totalSlippage = filteredTasks.reduce((total, task) => {
            if(!isNaN(task.durationSlippage)){
                return total + task.durationSlippage
            }
            else{
                return total;
            }
        }, 0);

        const nonNaNCount = filteredTasks.filter(task => !isNaN(task.durationSlippage)).length;
        const averageSlippage = nonNaNCount > 0 ? totalSlippage / nonNaNCount : 0;
        const averageSlippageRounded = averageSlippage.toFixed(2); 
      
        return parseFloat(averageSlippageRounded);    
    };

    const calculateActualDuration = (startDate: Date, endDate: Date) => {
        const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
        const start = new Date(startDate);
        const end = new Date(endDate);
        let totalDays = Math.floor((end.getTime() - start.getTime()) / oneDay) + 1; // Including start and end dates
      
        // Exclude weekends (Saturday and Sunday)
        let remainingDays = totalDays;
        let weekends = 0;
      
        while (remainingDays > 0) {
          const currentDay = start.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
      
          if (currentDay === 5 || currentDay === 6) {
            weekends++;
          }
      
          start.setDate(start.getDate() + 1);
          remainingDays--;
        }
      
        const actualDuration = totalDays - weekends;
        return actualDuration;
      };

    const calculateProjectedProjectDuration = (tasks: Task[]) => {
    
      const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
      let earliestStart = new Date(4000, 0, 1);
      let latestEnd = new Date(1950, 0, 1);

      for (let i = 0; i < tasks.length; i++) {
        const taskStart = new Date(tasks[i].expectedStart);
        const taskEnd = new Date(tasks[i].expectedFinish);
    
        if (taskStart < earliestStart) {
          earliestStart = taskStart;
        }
    
        if (taskEnd > latestEnd) {
          latestEnd = taskEnd;
        }
      } 
      
      let totalDuration = Math.round((latestEnd.getTime() - earliestStart.getTime()) / oneDay) + 1;
    
      let remainingDays = totalDuration;
      let weekends = 0;
      let currentDay = earliestStart.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
    
      while (remainingDays > 0) {
        if (currentDay === 5) { // Saturday
          weekends++;
        } else if (currentDay === 6) { // Sunday
          weekends++;
        }
        earliestStart.setDate(earliestStart.getDate() + 1);
        currentDay = earliestStart.getDay()
        remainingDays--;
      }
      
      totalDuration = totalDuration - weekends;

      if (totalDuration === -748746){
        return 0
      }
      return totalDuration;
    };

    const calculateActualProjectDuration = (tasks: Task[]) => {
      const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
      let earliestStart = new Date(4000, 0, 1);
      let latestEnd = new Date(1950, 0, 1);

      for (let i = 0; i < tasks.length; i++) {
        const taskStart = new Date(tasks[i].start);
        const taskEnd = new Date(tasks[i].finish);
    
        if (taskStart < earliestStart) {
          earliestStart = taskStart;
        }
    
        if (taskEnd > latestEnd) {
          latestEnd = taskEnd;
        }
      } 
      
      let totalDuration = Math.round((latestEnd.getTime() - earliestStart.getTime()) / oneDay) + 1;
    
      let remainingDays = totalDuration;
      let weekends = 0;
      let currentDay = earliestStart.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
    
      while (remainingDays > 0) {
        if (currentDay === 5) { // Saturday
          weekends++;
        } else if (currentDay === 6) { // Sunday
          weekends++;
        }
        earliestStart.setDate(earliestStart.getDate() + 1);
        currentDay = earliestStart.getDay()
        remainingDays--;
      }

      if (totalDuration === -748746){
        return 0
      }

      totalDuration = totalDuration;
      return totalDuration;
    };
      

      useEffect(() => {
        console.log(id);
    
        if (id) {
          setOutputStatus("Loading...");
          // Fetch tasks
          axios
            .get(`/api/getalltasksforaproject?id=${id}`)
            .then((response) => {
              const tasksWithData = response.data.map((task: any) => ({
                ...task,
                projectId: task.projectId,
                step: task.step,
                startCheck: task.startCheck,
                finishCheck: task.finishCheck,
                task: task.task,
                lead: task.lead,
                duration: task.duration,
                expectedFinish: task.expectedFinish,
                expectedStart: task.expectedStart,
                start: task.start,
                finish: task.finish,
                remarks: task.remarks,
                executingSide: task.executingSide, // Fix: Access executingSide from task object
                
                actualDuration: calculateActualDuration(new Date(task.start), new Date(task.finish)),

              //   actualDuration: Math.floor(((new Date(task.finish).getTime() - new Date(task.start).getTime()) / (1000 * 60 * 60 * 24))+1),
                scheduleSlippage: Math.floor(((new Date(task.start).getTime() - new Date(task.expectedStart).getTime()) / (1000 * 60 * 60 * 24))),
              //   durationSlippage: Math.floor(Math.floor(((new Date(task.finish).getTime() - new Date(task.start).getTime()) / (1000 * 60 * 60 * 24))+1) - parseInt(task.duration))
                durationSlippage: Math.floor(calculateActualDuration(new Date(task.start), new Date(task.finish)) - parseInt(task.duration))

                

              }));
              
              setTasks(tasksWithData);
              console.log('Success');
              setOutputStatus("Task list has been loaded.");
            })
            .catch((error) => console.error('BONK Error retrieving tasks:', error));
        } 
        else {
          setOutputStatus("Task list could not be loaded.");
        }
      }, [id]
    );


    const calculatePercentageCompleted = (tasks: Task[]) => {
      const finishedTasks = tasks.filter(task => task.finishCheck);
      const percentageCompleted = (finishedTasks.length / tasks.length) * 100;
      return isNaN(percentageCompleted) ? 0 : percentageCompleted;
    };

    const renderCircleChart = (percentage: number) => {
      const radius = 40;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (circumference * percentage) / 100;
  
      return (
          <div>
            <svg className='w-[300px] h-[300px]' viewBox="0 0 100 100">
            <defs>
                  <linearGradient id="circle-gradient" gradientTransform="rotate(90)">
                  <stop offset="0%" stopColor="#2374F3" />
                  <stop offset="400%" stopColor="#57c7d4" />
                  </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r={radius}
                style={{
                  fill: 'none',
                  stroke: '#e5e5e5',
                  strokeWidth: '5px',
                }}
              ></circle>
              <circle
                cx="50"
                cy="50"
                r={radius}
                style={{
                  fill: 'none',
                  stroke: 'url(#circle-gradient)',
                  strokeWidth: '5px',
                  strokeDasharray: circumference,
                  strokeDashoffset: offset,
                  transition: 'stroke-dashoffset 0.9s ease',
                }}
              ></circle>
              <text
                x="50"
                y="45"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: '10px',
                  fill: 'url(#circle-gradient)',
                  fontWeight: 'bold',
                }}
              >
                  <tspan>{percentage.toFixed(2)}%</tspan>
                  <tspan x="50" dy="1.2em" style={{ fontSize: '10px', fill: 'url(#circle-gradient)' }}>Complete</tspan>
              </text>
            </svg>
          </div>
        );
        
    };

    const [showInfoTab, setShowInfoTab] = useState(false);

    const handleClick = (event: any) => {
      event.preventDefault();
      setShowInfoTab(!showInfoTab); // Toggle the visibility of the info tab
    };

    const today = new Date();
    
    function isValidDate(dateString:any) {
      return !isNaN(Date.parse(dateString));
    }

    const renderNextTasksDue = () => {
      
      const unfinishedTasks = tasks.filter(task => task.expectedStart && !task.finishCheck);
      const sortedTasks = [...unfinishedTasks].sort((a, b) => {
        const timestampA = new Date(a.expectedStart).getTime();
        const timestampB = new Date(b.expectedStart).getTime();
        return timestampA - timestampB;
      });
    
      const nextTasksDue = sortedTasks.slice(0, 3);
    
      const todayString = today.toISOString().slice(0, 10);
    
      return (
        <div className="pb-8">
          <div className='bg-white flex flex-col justify-center w-screen'>
            <div className="flex px-24 pb-2 font-bold text-primary-blue opacity-60">Upcoming Tasks</div>
            <div className='flex justify-center'>
              <div className="border-b-2">
                <div className='flex grid-cols-11 justify-start py-4 '>
                  <div className="w-[60px] px-4 text-xs text-gray-350">ES</div>
                  <div className="w-[350px] px-4 text-xs text-primary-blue">TASK</div>
                  <div className="w-[120px] px-4 text-xs">Assigned To</div>
                  <div className="w-[200px] px-4 text-xs ">Expected Start</div>
                  <div className="w-[200px] px-4 text-xs ">Expected Finish</div>
                  <div className="w-[100px] px-4 text-xs">Duration</div>
                </div>
              </div>
            </div>
          </div>
    
          <div className='flex justify-center'>
            <div className='pt-2 space-y-1 '>
              {nextTasksDue.length === 0 ? (
                <div className= "flex gap-2 justify-center items-center">
                  <div className="font-bold opacity-30 text-sm">Congratulations, you&apos;ve completed all your tasks (with provided start dates) !</div>
                  <img src="/celebrate2.png" className= "w-6 h-6"></img>
                </div>
              ) : (
                <>
                  {nextTasksDue.map((task, index) => (
                    <div key={index} className="flex justify-between grid-cols-11 justify-start py-2 px-4">
                      <div className='flex grid-cols-8 bg-white'>
                        <div className="flex justify-center w-[25px] bg-gray-300 rounded-lg px-1 text-white max-h-[30px]"> {task.step}</div>
                        <div className={`pt-1 w-[50px] px-4 text-xs border-r-[1px] border-r-gray-350 font-bold ${task.executingSide.charAt(0) === 'A' ? 'text-pink-500' : 'text-purple-500' }`}>
                          {task.executingSide.charAt(0)}
                        </div>
                        <div className='w-[370px] border-r-[1px] border-r-gray-350 px-4 text-xs'>
                          {task.task}
                        </div>
                        <div className='pt-1 w-[120px] px-4 text-xs overflow-hidden border-r-[1px] border-r-gray-350 '>
                          {task.lead}
                        </div>
                        <div className={`pt-1 w-[200px] px-4 text-xs border-r-[1px] border-r-gray-350 ${isValidDate(task.expectedStart) && new Date(task.expectedStart).toISOString().slice(0, 10) < todayString ? 'text-red-500' : isValidDate(task.expectedStart) && new Date(task.expectedStart).toISOString().slice(0, 10) === todayString ? 'text-primary-blue' : '' }`}>
                          {task.expectedStart}
                        </div>
                        <div className={`pt-1 w-[200px] px-4 text-xs border-r-[1px] border-r-gray-350 ${isValidDate(task.expectedFinish) && new Date(task.expectedFinish).toISOString().slice(0, 10) < todayString ? 'text-red-500' : isValidDate(task.expectedFinish) && new Date(task.expectedFinish).toISOString().slice(0, 10) === todayString ? 'text-primary-blue' : '' }`}>
                          {task.expectedFinish}
                        </div>
                        <div className="w-[100px] px-4 text-xs">
                          {task.duration + " days"} 
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      );
    };

    const renderTasks = () => {
        const sortedTasks = [...tasks].sort((a, b) => a.step - b.step);
        return (
          <div className='flex flex-col'>
            <div className='flex justify-end w-screen px-64 pt-8'>
              <Link className='flex justify-center align-center rounded-lg text-white bg-primary-blue border-2 border-primary-blue text-sm px-4 w-48 py-2 hover:shadow-md hover:bg-white hover:text-primary-blue hover:border-primary-blue hover:border-2'
                    href={{
                    pathname: '/myTrackerSubpage',
                    query: {
                        id: id,
                        purchaseOrderCode: purchaseOrderCode,
                        productModel: productModel,
                        orderDate: orderDate,
                        orderQuantity: orderQuantity,
                        projectStartDate: projectStartDate
                    },
                    }}>
                    <div className='font-bold'>
                      Edit Project
                    </div>
                </Link>
            </div>
            <div className='flex justify-between w-screen px-48 pb-4'>
                <div className="flex justify-center items-center">
                    {renderCircleChart(calculatePercentageCompleted(sortedTasks))}
                </div>

                <div className='flex justify-center items-center'>
                    <div className="p-12 text-lg text-black border-2 shadow-md rounded-lg">
                        <div className='pb-4 flex justify-center font-bold opacity-40'> Avg. Task Duration Slippage</div>
                        <div className='grid grid-cols-2 gap-8'>
                            <div className='flex flex-col justify-start gap-2'>
                                <div className='flex justify-center text-3xl font-bold text-pink-500'>{calculateAverageDurationSlippage(sortedTasks, 'A Enterprise') + " days"}</div>
                                <div className='flex justify-center text-sm italic text-pink-500'>A Enterprise</div>
                            </div>
                            <div className='flex flex-col justify-end gap-2'>
                                <div className='flex justify-center text-3xl font-bold text-purple-700'>{calculateAverageDurationSlippage(sortedTasks, 'B Enterprise') + " days"}</div>
                                <div className='flex justify-center text-sm italic text-purple-700'>B Enterprise</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex justify-center items-center'>
                    <div className="p-12 text-lg text-black border-2 shadow-md rounded-lg">
                        <div className='pb-4 flex justify-center font-bold opacity-40'> Avg. Task Schedule Slippage</div>
                        <div className='grid grid-cols-2 gap-8'>
                            <div className='flex flex-col justify-start gap-2'>
                                <div className='flex justify-center text-3xl font-bold text-pink-500'>{calculateAverageScheduleSlippage(sortedTasks, 'A Enterprise') + " days"}</div>
                                <div className='flex justify-center text-sm italic text-pink-500'>A Enterprise</div>
                            </div>
                            <div className='flex flex-col justify-end gap-2'>
                                <div className='flex justify-center text-3xl font-bold text-purple-700'>{calculateAverageScheduleSlippage(sortedTasks, 'B Enterprise') + " days"}</div>
                                <div className='flex justify-center text-sm italic text-purple-700'>B Enterprise</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className='flex justify-between w-screen px-48 py-4'>
                <div className='flex justify-center items-center'>
                    <div className="py-4 px-12 text-lg text-black border-2 shadow-md rounded-lg">
                        <div className='pb-4 flex justify-center font-bold opacity-40'>Projected Project Duration</div>
                        <div className=''>
                            <div className='flex flex-col justify-start gap-2'>
                                <div className='flex justify-center text-3xl font-bold opacity-40'>{calculateProjectedProjectDuration(sortedTasks) + " days"}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex justify-center items-center'>
                    <div className="py-4 px-12 text-lg text-black border-2 shadow-md rounded-lg">
                        <div className='pb-4 flex justify-center font-bold opacity-40'>Actual Project Duration</div>
                        <div className=''>
                            <div className='flex flex-col justify-start gap-2'>
                                <div className='flex justify-center text-3xl font-bold opacity-40'>{calculateActualProjectDuration(sortedTasks) + " days"}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex justify-center items-center'>
                    <div className="py-4 px-12 text-lg text-black border-2 shadow-md rounded-lg">
                        <div className='pb-4 flex justify-center font-bold opacity-40'>Project Duration Slippage</div>
                        <div className=''>
                            <div className='flex flex-col justify-start gap-2'>
                                <div className='flex justify-center text-3xl font-bold opacity-40'>{calculateActualProjectDuration(sortedTasks) - calculateProjectedProjectDuration(sortedTasks) + " days"}</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className='flex justify-end w-screen px-64 pt-8 gap-8 items-center pb-4'>
              <div className='flex justify-end text-xs text-gray-600'>
                  *All Calculations Exclude Weekends.
              </div>
              <div className='opacity-70 text-sm'>
                  For More Info About This Page:
              </div>
             
              <a href="#infoTab" onClick={handleClick}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className=" opacity-80 w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>  
              </a>
            </div>

            {showInfoTab && (
              <div className='absolute w-screen flex justify-center'>
                <div id='infoTab' className='bg-white px-24 py-8 border-gray-200 border-2 rounded-xl shadow-md max-w-[900px] text-sm'>
                  {/* Add the content of your info tab here */}
                  <div className='pb-4 font-bold flex justify-center'>
                    What&apos;s on This Page?
                  </div>
                  <div className='font-semibold flex justify-center text-red-500 text-sm text-center'>
                    IMPORTANT: To receive Project Analytics, you must have selected an option for &ldquo;ES&rdquo; on each task.
                  </div>
                  <div className='pb-4 font-semibold text-primary-blue text-sm text-center flex justify-center gap-12'>
                    <div>F = Finished</div>
                    <div>ES = Executing Side</div>
                  </div>
                  <div className=' pb-2'>
                    Upcoming Tasks are the top unfinished tasks with the earliest expected start dates.
                  </div>
                  <div className='font-bold'>
                    For Each Project
                  </div>
                  <ul className='list-disc pl-8 text-sm pb-4'>
                      <li><span className='text-primary-blue'>Average Duration Slippage (For Each Enterprise)</span> = (Σ Duration Slippage by Enterprise) / Number Tasks <span className='font-bold'>Completed</span> by Enterprise</li>
                      <li><span className = "text-primary-blue">Average Schedule Slippage (For Each Enterprise)</span> = (Σ Schedule Slippage by Enterprise) / Number Tasks <span className='font-bold'>Completed</span> by Enterprise</li>
                      <li><span className = "text-primary-blue">% Completion</span> = (Σ Tasks marked &ldquo;F&rdquo;)/Number of Tasks Total</li>

                  </ul> 
                  <div className='font-bold'>
                    For Each Task
                  </div>
                  <ul className='list-disc pl-8 text-sm '>
                      <li><span className = "text-primary-blue">Actual Duration</span> = Actual Finish - Actual Start </li>
                      <li><span className = "text-primary-blue">Duration Slippage</span> = Actual Duration - Duration (based on Expected Finish - Expected Start)</li>
                      <li><span className = "text-primary-blue">Schedule Slippage</span> = Actual Start - Projected Start</li> 
                  </ul> 
                  
                </div>
              </div>
            )}

            {renderNextTasksDue()}


            <div className='bg-white flex flex-col justify-center w-screen'>
            <div className= "flex px-24 pb-2 font-bold text-primary-blue opacity-60">All Tasks</div>

                <div className='flex justify-center'>
                    <div className=" border-b-2">
                    {/* <div className="grid justify-start py-2 px-4 rounded-xl font-semibold text-xs text-gray-500"> */}
                        <div className='flex grid-cols-11 justify-start py-4 '>
                            {/* <div className="flex jusitfy-center w-[25px] rounded-lg mx-auto px-1 text-white"> </div> */}
                            <div className="w-[50px] px-2 text-xs font-bold flex justify-start">F</div>
                            <div className="w-[50px] px-[1px] text-xs text-gray-350">ES</div>
                            <div className="w-[350px] px-4 text-xs text-primary-blue">TASK</div>
                            <div className="w-[130px] px-4 text-xs">Assigned To</div>
                            {/* <div className="w-[120px] px-4 text-xs">Exp. Start</div>
                            <div className="w-[120px] px-4 text-xs">Exp. Finish</div> */}
                            <div className="w-[110px] px-4 text-xs ">Start</div>
                            <div className="w-[120px] px-4 text-xs ">Finish</div>
                            <div className="w-[110px] px-4 text-xs">Duration</div>

                            <div className="w-[150px] px-4 text-xs text-primary-blue font-bold">Actual Duration</div>
                            <div className="w-[150px] px-4 text-xs text-primary-blue font-bold ">Duration Slippage</div>
                            <div className="w-[160px] px-4 text-xs text-primary-blue font-bold">Schedule Slippage</div>
                            <div className="w-[140px] px-4 text-xs ">Remarks</div>
                        </div>
                      {/* </div> */}
                    </div>
                </div>
           
            <div className='flex justify-center'>
                <div className='pt-2 space-y-1 '>
                {sortedTasks.map((task: any, index: number) => (
                    <div key={task.id}
                        className={`flex justify-between grid-cols-11 justify-start py-4 px-4 ${
                        index === selectedRow ? 'border-4 border-primary-blue border-opacity-20 rounded-xl' : ''
                      }`}
                      onClick={() => handleRowClick(index)}
                     >
                    <div className='flex grid-cols-8 bg-white'>
                        <div className="flex jusitfy-center w-[25px] bg-gray-300 rounded-lg px-1 text-white max-h-[30px]"> {task.step}
                        </div>

                        <div className="w-[50px] px-4 font-bold">
                        <input type="checkbox" checked={task.finishCheck} 
                        />
                        </div>

                        <div className={`pt-1 w-[50px] px-4 text-xs border-r-[1px] border-r-gray-350 font-bold ${task.executingSide.charAt(0) === 'A' ? 'text-pink-500':'text-purple-500' }`}>
                            {task.executingSide.charAt(0)}
                        </div>

                        <div
                            className='w-[370px] border-r-[1px] border-r-gray-350 px-4 text-xs'>
                            {task.task}
                            
                        </div>
                        
                        
                        <div className='pt-1 w-[120px] px-4 text-xs overflow-hidden border-r-[1px] border-r-gray-350 '>
                            {task.lead}
                        </div>


                        <div className='w-[120px] border-r-[1px] border-r-gray-350 px-4 text-xs '>
                            {task.start}
                        </div>

                        <div className='w-[120px] border-r-[1px] border-r-gray-350 px-4 text-xs'>
                            {task.finish}
                        </div>

                        <div
                            className="w-[100px]  px-4 text-xs">
                            {task.duration + " days"} 
                        </div>
                        
                        <div className={`flex justify-center items-center w-[130px] px-4 text-xs border-2 p-1 rounded-lg hover:border-primary-blue text-primary-blue mx-2 font-bold ${task.actualDuration > task.duration ? 'text-red-500' : isNaN(Number(task.actualDuration)) ? 'text-black opacity-20' : ''}`}>
                            {task.actualDuration + " days"}
                        </div>


                        <div className={`flex items-center justify-center w-[150px] px-4 text-xs border-2 p-1 rounded-lg hover:border-primary-blue text-primary-blue  mx-2 font-bold ${task.durationSlippage > 0 ? 'text-red-500' : isNaN(Number(task.durationSlippage)) ? 'text-black opacity-20' : task.durationSlippage < 0 ? 'text-primary-green' :''}`}>
                            {task.durationSlippage + " days"}
                        </div>

                        <div className={`flex justify-center items-center w-[150px] px-4 text-xs border-2 p-1 rounded-lg hover:border-primary-blue text-primary-blue  mx-2 font-bold ${task.scheduleSlippage > 0 ? 'text-red-500' : task.scheduleSlippage < 0 ? 'text-primary-green' : isNaN(Number(task.scheduleSlippage)) ? 'text-black opacity-20' :''}`}>
                            {task.scheduleSlippage + " days"}
                        </div>

                        <div style={{ height: '40px', overflow: 'auto' }}>
                          <div className="flex justify-start w-[170px] text-xs border-[1px] p-1 rounded-lg hover:border-primary-blue mx-2">
                            {task.remarks}
                          </div>
                        </div>



                        
                    </div>
                    </div>    
                ))}
                </div>
              </div>
            </div>
          </div>
        );
      };



    return(
        <div>
         <Navbar userEmail=''></Navbar>

          <div className="pt-24 pb-12">
            <div className="rounded-lg px-24">
              <div>
                <div className="grid grid-cols-3 rounded-lg overflow-hidden border shadow-md bg-white">

                  <div className="flex space-x-4 py-4 px-4">
                    <div className="text-primary-blue font-bold">Project Name:</div>
                    <input
                        className=''
                        type="text"
                        value={productModel}
                      /> 
                  </div>
                  <div className="flex space-x-4 py-4 px-4">
                    <div className="text-primary-blue font-bold">Project Code:</div>
                    <input
                        className=''
                        type="text"
                        value={purchaseOrderCode}
                      /> 
                  </div>
                  <div className="flex space-x-4 py-4 px-4">
                    <div className="text-primary-blue font-bold">Order Qty:</div>
                    <input
                        className=''
                        type="text"
                        value={orderQuantity}
                      /> 
                  </div>
                  <div className="flex space-x-4 py-4 px-4">
                    <div className="text-primary-blue font-bold">Order Date:</div>
                    <input
                        className=''
                        type="text"
                        value={orderDate}
                      /> 
                  </div>
                  <div className="flex space-x-4 py-4 px-4">
                    <div className="text-primary-blue font-bold">Start Date:</div>
                    <input
                        className=''
                        type="text"
                        value={projectStartDate}
                      /> 
                  </div>

                  <div className="flex space-x-4 py-4 px-4">
                     <div className="text-primary-blue font-bold">ID:</div>
                     <input
                        className=''
                        type="text"
                        value={id}
                      /> 
                  </div>
                </div>
              </div>
            </div>



            <div className="mt-4 px-2">
              
                <div className='flex flex-row'>
                    {renderTasks()}
                </div>
            </div>
            <div className='flex justify-center pt-4 text-red-500 text-xs'>
              {outputStatus}
            </div>
        </div>

        </div>
    )
}