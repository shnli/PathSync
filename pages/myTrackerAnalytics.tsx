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
      
          if (currentDay === 0 || currentDay === 6) {
            weekends++;
          }
      
          start.setDate(start.getDate() + 1);
          remainingDays--;
        }
      
        const actualDuration = totalDays - weekends;
        return actualDuration;
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
    }, [id]);


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


    const renderTasks = () => {
        const sortedTasks = [...tasks].sort((a, b) => a.step - b.step);
        return (
          <div className='flex flex-col'>
            <div className='flex justify-between w-screen px-64 pb-8'>
                <div className="flex justify-center items-center">
                    {renderCircleChart(calculatePercentageCompleted(sortedTasks))}
                </div>

                <div className='flex justify-center items-center'>
                    <div className="p-8 text-lg text-black border-2 shadow-md rounded-lg">
                        <div className='pb-4 flex justify-center font-bold opacity-40'> Average Duration Slippage</div>
                        <div className='grid grid-cols-2 gap-8'>
                            <div className='flex flex-col justify-start gap-2'>
                                <div className='flex justify-center text-3xl font-bold text-purple-800'>{calculateAverageDurationSlippage(sortedTasks, 'A Enterprise') + " days"}</div>
                                <div className='flex justify-center text-sm italic text-purple-800'>A Enterprise</div>
                            </div>
                            <div className='flex flex-col justify-end gap-2'>
                                <div className='flex justify-center text-3xl font-bold text-orange-500'>{calculateAverageDurationSlippage(sortedTasks, 'B Enterprise') + " days"}</div>
                                <div className='flex justify-center text-sm italic text-orange-500'>B Enterprise</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex justify-center items-center'>
                    <div className="p-8 text-lg text-black border-2 shadow-md rounded-lg">
                        <div className='pb-4 flex justify-center font-bold opacity-40'> Average Schedule Slippage</div>
                        <div className='grid grid-cols-2 gap-8'>
                            <div className='flex flex-col justify-start gap-2'>
                                <div className='flex justify-center text-3xl font-bold text-purple-800'>{calculateAverageScheduleSlippage(sortedTasks, 'A Enterprise') + " days"}</div>
                                <div className='flex justify-center text-sm italic text-purple-800'>A Enterprise</div>
                            </div>
                            <div className='flex flex-col justify-end gap-2'>
                                <div className='flex justify-center text-3xl font-bold text-orange-500'>{calculateAverageScheduleSlippage(sortedTasks, 'B Enterprise') + " days"}</div>
                                <div className='flex justify-center text-sm italic text-orange-500'>B Enterprise</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className='flex justify-end w-screen px-32 pb-4 text-xs text-gray-400'>
                *All Calculations Exclude Weekends
            </div>
            
            <div className='bg-white flex flex-col justify-center w-screen'>
                <div className='flex justify-center'>
                    <div className="grid border-b-2">
                    <div className="grid justify-start py-2 px-4 rounded-xl font-semibold text-xs text-gray-500">
                        <div className='flex grid-cols-11'>
                        <div className="flex jusitfy-center w-[25px] rounded-lg mx-auto px-1 text-white"> </div>
                            <div className="w-[50px] px-4 font-bold">F</div>
                            <div className="w-[50px] px-4 text-xs text-gray-350">ES</div>
                            <div className="w-[400px] px-4 text-xs text-primary-blue">TASK</div>
                            <div className="w-[120px] px-4 text-xs">Assigned To</div>
                            {/* <div className="w-[120px] px-4 text-xs">Exp. Start</div>
                            <div className="w-[120px] px-4 text-xs">Exp. Finish</div> */}
                            <div className="w-[120px] px-4 text-xs ">Start</div>
                            <div className="w-[120px] px-4 text-xs ">Finish</div>
                            <div className="w-[100px] px-4 text-xs">Duration</div>

                            <div className="w-[130px] px-4 text-xs text-primary-blue font-bold">Actual Duration</div>
                            <div className="w-[150px] px-4 text-xs text-primary-blue font-bold">Duration Slippage</div>
                            <div className="w-[150px] px-4 text-xs text-primary-blue font-bold">Schedule Slippage</div>
                        </div>
                        </div>
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
                        <div className="flex jusitfy-center w-[25px] bg-gray-300 rounded-lg px-1 text-white"> {task.step}
                        </div>

                        <div className="w-[50px] px-4 font-bold">
                        <input type="checkbox" checked={task.finishCheck} 
                        />
                        </div>

                        <div className={`pt-1 w-[50px] px-4 text-xs border-r-[1px] border-r-gray-350 font-bold ${task.executingSide.charAt(0) === 'A' ? 'text-orange-500':'text-purple-500' }`}>
                            {task.executingSide.charAt(0)}
                        </div>

                        <div
                            className='w-[400px] border-r-[1px] border-r-gray-350 px-4 text-xs'>
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
                        
                        <div className={`flex justify-center  w-[130px] px-4 text-xs border-2 p-1 rounded-lg hover:border-primary-blue text-primary-blue mx-2 font-bold ${task.actualDuration > task.duration ? 'text-red-500' : isNaN(Number(task.scheduleSlippage)) ? 'text-black opacity-20' : ''}`}>
                            {task.actualDuration + " days"}
                        </div>


                        <div className={`flex justify-center w-[150px] px-4 text-xs border-2 p-1 rounded-lg hover:border-primary-blue text-primary-blue  mx-2 font-bold ${task.durationSlippage > 0 ? 'text-red-500' : isNaN(Number(task.durationSlippage)) ? 'text-black opacity-20' : task.durationSlippage < 0 ? 'text-green-600' :''}`}>
                            {task.durationSlippage + " days"}
                        </div>

                        <div className={`flex justify-center w-[150px] px-4 text-xs border-2 p-1 rounded-lg hover:border-primary-blue text-primary-blue  mx-2 font-bold ${task.scheduleSlippage > 0 ? 'text-red-500' : isNaN(Number(task.scheduleSlippage)) ? 'text-black opacity-20' : task.scheduleSlippage < 0 ? 'text-green-600' :''}`}>
                            {task.scheduleSlippage + " days"}
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
                    <div className="text-primary-blue font-bold">Product Model:</div>
                    <input
                        className=''
                        type="text"
                        value={productModel}
                      /> 
                  </div>
                  <div className="flex space-x-4 py-4 px-4">
                    <div className="text-primary-blue font-bold">Purchase Order Code:</div>
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