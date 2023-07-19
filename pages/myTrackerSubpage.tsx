import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import Navbar from '../components/Navbar/Navbar';
import React from 'react';
import { Task } from '@prisma/client';




export default function MyTrackerSubpage()  {
  const router = useRouter();
  const { id, purchaseOrderCode, productModel, orderDate, orderQuantity, projectStartDate } = router.query;
  const projectId = Number(id); 

  const [tasks, setTasks] = useState<{
    id: number;
    
    step: number,
    startCheck: Boolean,
    finishCheck: Boolean,
    
    task: string,
    lead: string,
    duration:string,
    expectedStart:string,
    expectedFinish:string,
    start:string,
    finish:string,
    remarks:string,
    executingSide:string,

    projectId: number
    }[]>([]);


    const [outputStatus, setOutputStatus] = useState<string>('');

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
              executingSide: task.executingSide // Fix: Access executingSide from task object
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
        

        const handleStartCheckChange = (index:any) => {
          const newTasks = [...tasks];
          const sortedTasks = newTasks.sort((a, b) => a.step - b.step); 
          sortedTasks[index].startCheck = !sortedTasks[index].startCheck;
          setTasks(sortedTasks);
        };
        
        const handleFinishCheckChange = (index:any) => {
          const newTasks = [...tasks];
          const sortedTasks = newTasks.sort((a, b) => a.step - b.step); 
          sortedTasks[index].finishCheck = !sortedTasks[index].finishCheck;
          setTasks(sortedTasks);
        };

        
        const [savingStatus, setSavingStatus] = useState<string>('');


        const saveTasks = async () => {
          try {
            setSavingStatus('Saving...');

            const email = localStorage.getItem('email');
            const password = localStorage.getItem('password');
            if (!email || !password) {
              console.error('Email or password not found in local storage');
              return;
            }
              const me = await axios.post('/api/auth/me', {
              email: email,
              password: password,
            });
            const authorId = me.data.id;
      
            // const saveProject = await axios.post("/api/saveproject", {
            //   productModel: productModel,
            //   purchaseOrderCode: purchaseOrderCode,
            //   orderQuantity: orderQuantity,
            //   orderDate: orderDate,
            //   projectStartDate: projectStartDate,
            //   authorId: authorId
            // });

            // const projectId = saveProject.data.id;
              
            for (let i = 0; i < tasks.length; i++) {
              console.log(i)
              const task = tasks[i];
              if (task.id === 0) {
                const newTaskResponse = await axios.post('/api/createtask', {
                  ...task,
                  projectId: projectId,
                  authorId: authorId,
                });
                const newTaskId = newTaskResponse.data.id;
                setTasks(prevTasks => {
                  const updatedTasks = [...prevTasks];
                  updatedTasks[i] = { ...updatedTasks[i], id: newTaskId };  // Update the task with a new ID
                  return updatedTasks;
                });
              }
              else{
                await axios.post('/api/updatetasks', task);

              }
            }

            setSavingStatus("Project saved successfully!");
            console.log("Project and tasks saved successfully!");
          } catch (error) {
            setSavingStatus("Error saving project. Please try again.");
            console.error("Error saving project and tasks:", error);
          }
        };


        const handleTaskChange = (e: any, index: number, field: keyof Task) => {
          const { value } = e.target;
          setTasks(prevTasks => {
            const newTasks = [...prevTasks];
            const sortedTasks = newTasks.sort((a, b) => a.step - b.step); 
            sortedTasks[index] = {
              ...sortedTasks[index],
              [field]: value,
            };
            return sortedTasks;
          });
        };


        const [insertIndex, setInsertIndex] = useState<number>(-1);
        const rightClickedTaskRef = useRef<HTMLDivElement | null>(null);
        const [stepNumber, setStepNumber] = useState(1);

        const updateStepNumbers = () => {
          setTasks(prevTasks => {
            return prevTasks.map((task, index) => ({
              ...task,
              step: index + 1
            }));
          });
        };

        const handleAddTask = () => {
          setTasks(prevTasks => [
            ...prevTasks,
            {
              id: 0,
              step: tasks.length + 1,
              startCheck: false,
              finishCheck: false,
              task: '',
              lead: '',
              duration: '',
              expectedStart: '',
              expectedFinish: '',
              start: '',
              finish: '',
              remarks: '',
              executingSide: '',
              projectId: 0
            },
          ]);
          setRowIndex(rowIndex + 1);          
          setStepNumber(prevStepNumber => prevStepNumber + 1);
        };

        const handleTaskRightClick = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
          e.preventDefault(); // Prevent the default right-click context menu
        
          setInsertIndex(index); // Set the index where the task should be inserted
          setShowInsertTaskButton(true); // Show the insert task button
        }

        const handleAddTaskAbove = () => {
          setTasks((prevTasks) => {
            const newTasks = [...prevTasks];
        
            newTasks.splice(insertIndex, 0, {
              id: 0,
              step: stepNumber,
              startCheck: false,
              finishCheck: false,
              task: '',
              lead: '',
              duration: '',
              expectedStart: '',
              expectedFinish: '',
              start: '',
              finish: '',
              remarks: '',        
              executingSide: '',
              projectId: 0,
            });            // Update the step numbers
            newTasks.forEach((item, idx) => {
              item.step = idx + 1; // Use idx here instead of index
            });
        
            return newTasks;
          });
        
          setInsertIndex(-1); // Reset the insertIndex
        };
    
        const [showInsertTaskButton, setShowInsertTaskButton] = useState(false);
        const handleCancelInsertion = () => {
          setInsertIndex(-1); // Reset the insertIndex
          setShowInsertTaskButton(false); // Hide the insert task button
        };

        const handleMoveTask = (index: number, direction: 'up' | 'down') => {
          setTasks(prevTasks => {
            const newData = [...prevTasks];
            const task = newData[index];
            newData.splice(index, 1); // Remove the task from the current position
        
            if (direction === 'up') {
              newData.splice(index - 1, 0, task); // Insert the task one position above
            } else {
              newData.splice(index + 1, 0, task); // Insert the task one position below
            }
    
            newData.forEach((item, idx) => {
              item.step = idx + 1;
            });
        
            return newData;
          });
        };

        const handleDeleteTask = async (index: number) => {
          const taskToDelete = tasks[index];
        
          try {
            await axios.post('/api/deletetask', { id: taskToDelete.id }); // Pass 'id' instead of 'taskId'
            setTasks(prevTasks => {
              const newTasks = [...prevTasks];
              newTasks.splice(index, 1); // Remove the task at the specified index
              return newTasks;
            });
            updateStepNumbers();
            console.log('Task deleted successfully!');
          } catch (error) {
            console.error('Error deleting task:', error);
          }
        };
      
      const [rowIndex, setRowIndex] = useState(0);


      const handleDropDownChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number, field: keyof Task) => {
        const { value } = e.target;
        setTasks(prevTasks => {
          const newTasks = [...prevTasks];
          const sortedTasks = newTasks.sort((a, b) => a.step - b.step);
          sortedTasks[index] = {
            ...sortedTasks[index],
            [field]: value,
          };
          return sortedTasks;
        });
      }

      const renderTasks = () => {
        const sortedTasks = [...tasks].sort((a, b) => a.step - b.step);
        return (
          <>
            <div className='grid bg-white'>
                <div className="grid rounded-xl ">
                  <div className="grid justify-start py-2 px-4 rounded-xl font-semibold text-xs text-gray-500">
                    <div className='flex grid-cols-8 '>
                      <div className="flex jusitfy-center w-[20px] rounded-lg mx-auto px-1 text-white"> </div>
                        <div className="w-[50px] px-4">S</div>
                        <div className="w-[50px] px-4 font-bold">F</div>
                        <div className="w-[400px] px-4 text-xs text-primary-blue">TASK</div>
                        <div className="w-[120px] px-4 text-xs">Assigned To</div>
                        <div className="w-[100px] px-4 text-xs">Duration</div>
                        <div className="w-[120px] px-4 text-xs">Exp. Start</div>
                        <div className="w-[120px] px-4 text-xs">Exp. Finish</div>
                        <div className="w-[120px] px-4 text-xs text-primary-blue">Start</div>
                        <div className="w-[120px] px-4 text-xs text-primary-blue">Finish</div>
                        <div className="w-[200px] px-4 text-xs text-gray-350">REMARKS</div>
                        <div className="w-[60px] px-4 text-xs text-gray-350">ES</div>
                      </div>
                    </div>
              </div>

              <div className='pt-2 space-y-1 '>
              {sortedTasks.map((task: any, index: number) => (

                <div key={task.id} onContextMenu={(e) => handleTaskRightClick(e, index)} className={`flex justify-between grid-cols-7 justify-start py-4 px-4 ${index % 2 === rowIndex % 2 ? 'border-2 rounded-lg' : ''}`}>
                  <div className='flex grid-cols-8 bg-white'>
                    <div className="flex jusitfy-center w-[20px] bg-gray-300 rounded-lg px-1 text-white"> {task.step}
                    </div>
                    <div className="w-[50px] px-4">
                      <input type="checkbox" checked={task.startCheck} onChange={() => handleStartCheckChange(index)} />
                    </div>
                    <div className="w-[50px] px-4 font-bold">
                      <input type="checkbox" checked={task.finishCheck} onChange={() => handleFinishCheckChange(index)} />
                    </div>

                    <div className='flex'>
                      <input
                        className='w-[400px] border-r-[1px] border-r-gray-350 px-4 text-xs'
                        type="text"
                        value={task.task}
                        onChange={(e) => handleTaskChange(e, index,'task')}
                        
                      />
                      </div>
                      
                      
                      <div className='pt-1 w-[120px] px-4 text-xs overflow-hidden'>
                      <input
                        value={task.lead}
                        onChange={(e) => handleTaskChange(e, index , 'lead')}
                        className="flex justify-center items-center w-[100px] px-4 text-xs">
                      </input>
                      </div>



                      <input
                        className="w-[100px] border-r-[1px] border-r-gray-350 px-4 text-xs"
                        type="text"
                        value={task.duration + " days"} // Concatenate " days" with the duration value
                        onChange={(e) => {
                          const { value } = e.target;
                          const parsedValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                          handleTaskChange(
                            { target: { value: parsedValue } }, index,
                            "duration"
                          );
                        }}
                      />
                      
                      <input
                        className='w-[120px] border-r-[1px] border-r-gray-350 px-4 text-xs'
                        type="date"
                        value={task.expectedStart}
                        onChange={(e) => handleTaskChange(e, index, 'expectedStart')}
                      />
                      <input
                        className='w-[120px] border-r-[1px] border-r-gray-350 px-4 text-xs'
                        type="date"
                        value={task.expectedFinish}
                        onChange={(e) => handleTaskChange(e, index, 'expectedFinish')}
                      />

                      <input
                        className='w-[120px] border-r-[1px] border-r-gray-350 px-4 text-xs text-primary-blue'
                        type="date"
                        value={task.start}
                        onChange={(e) => handleTaskChange(e,index, 'start')}
                      />
                      <input
                        className='w-[120px] border-r-[1px] border-r-gray-350 px-4 text-xs text-primary-blue'
                        type="date"
                        value={task.finish}
                        onChange={(e) => handleTaskChange(e,index, 'finish')}
                      />

                      <input
                        className='w-[200px] px-4 text-xs'
                        type="text"
                        value={task.remarks}
                        onChange={(e) => handleTaskChange(e,index, 'remarks')}
                      /> 

                      <div className='pt-1 w-[60px] px-4 text-xs overflow-hidden'>
                        <select value={task.executingSide} onChange={(e) => handleDropDownChange(e, index, 'executingSide')}
                          className="flex justify-center items-center px-4 text-xs">
                          <option selected value="Select">
                            --Select--
                          </option>

                          <option value="A Enterprise">
                            A Enterprise
                          </option>
                          
                          <option value="B Enterprise">
                            B Enterprise 
                          </option>
                        </select>
                      </div>

                  
                    {insertIndex !== -1 && (
                      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-200 opacity-80">
                        <div className="flex flex-col items-center">
                        <button
                          onClick={handleAddTaskAbove}
                          className="text-sm bg-white px-4 py-2 rounded shadow"
                        >
                          Insert Task Above
                        </button>
                          <button
                            onClick={handleCancelInsertion}
                            className="pt-2 text-sm text-red-500">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}


                    <div className="flex items-center justify-end space-x-1 px-4">
                      <button
                        onClick={() => handleMoveTask(index, 'up')}
                        disabled={index === 0}
                        className="text-xs text-gray-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-3 h-3">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
                        </svg>

                      </button>
                      <button
                        onClick={() => handleMoveTask(index, 'down')}
                        disabled={index === tasks.length - 1}
                        className="text-xs text-gray-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-3 h-3">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                        </svg>

                      </button>
                      <button
                        onClick={() => handleDeleteTask(index)}
                        className="text-xs text-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-3 h-3">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>

                      </button>
                    </div>

                  </div>


                </div>

                

              ))}
              </div>
            </div>
          </>
        );
      };
  
      


  return (
      <div className="h-screen bg-gray-50">
        
          <Navbar userEmail=''></Navbar>
          {/* <NavbarSide /> */}
          <div className="pt-24 pb-12">
            <div className="rounded-lg px-12">
      
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

            <div className='flex justify-center pt-4 text-red-500 text-xs'>
              {outputStatus}
            </div>

            <div className="mt-4 px-2">
                {renderTasks()}
            </div>
            


            <div className="pt-4 flex justify-between px-12">
              <button
                onClick={handleAddTask}
                className="border-gray-300 border-2 font-bold text-xs px-12 py-2 rounded-md shadow-sm hover:shadow-none text-gray-500"
              >
                Add Task
              </button>
              <button               
                className="font-bold text-xs px-12 py-2 rounded-md shadow-sm hover:shadow-none bg-primary-blue text-white"
                onClick={saveTasks}>Save Project
              </button>

            </div>
            {savingStatus && <div className='flex justify-center text-xs text-red-500'>{savingStatus}</div>}

            
        </div>

      </div>
    
  );
}