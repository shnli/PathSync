import { Task } from '@prisma/client';
import React, { useState, useRef, useEffect } from 'react';
import axios from "axios";
import { initialFormData } from "./PrimaryData";



// interface ExtendedTask extends Task {
//   step: number;
//   startCheck: boolean,
//   finishCheck: boolean,
//   task: string,
//   lead: string,
//   duration: string,
//   expectedStart: string,
//   expectedFinish: string,
//   start: string,
//   finish: task.finish,
//   remarks: task.remarks,
//   executingSide: task.executingSide,
//   projectId: projectId,
// }

export default function NewChecklist(props: {formData:initialFormData; engineerData: { SDRE: string; QO: string }; hardwareLeads: string[]; manufacturerLeads: string[];}) {
  const [checklistData, setChecklistData] = useState<Task[]>([]);
  const [savingStatus, setSavingStatus] = useState<string>('');

  const saveProject = async () => {
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

      const createdProject = await axios.post("/api/createproject", {
        productModel: props.formData.model,
        purchaseOrderCode: props.formData.purchaseOrder,
        productName: props.formData.productName,
        orderQuantity: props.formData.orderQuantity,
        orderDate: props.formData.orderDate,
        projectStartDate: props.formData.startDate,
        authorId: authorId
      });
  
      const projectId = createdProject.data.id;
  
      for (let i = 0; i < checklistData.length; i++) {
        const task = checklistData[i];
        await axios.post("/api/createtask", {
          step: task.step,
          startCheck: task.startCheck,
          finishCheck: task.finishCheck,
          task: task.task,
          lead: task.lead,
          duration: task.duration,
          expectedStart: task.expectedStart,
          expectedFinish: task.expectedFinish,
          start: task.start,
          finish: task.finish,
          remarks: task.remarks,
          executingSide: task.executingSide,
          projectId: projectId,
        });
      }
      setSavingStatus("Project saved successfully! Please navigate toMy Projects to EDIT this project. If you save again on this page, you will create another new project.");

      console.log("Project and tasks saved successfully!");
    } catch (error) {
      setSavingStatus("Error saving project. Please try again.");
      console.error("Error saving project and tasks:", error);
    }
  };




  ////////////


  // const [checklistData, setChecklistData] = useState<ExtendedTask[]>([]);


  const [stepNumber, setStepNumber] = useState(1);
  
  const [hardwareLeads, setHardwareLeads] = useState<string[]>(props.hardwareLeads);
  const [manufacturerLeads, setManufacturerLeads] = useState<string[]>(props.manufacturerLeads);

  useEffect(() => {
    localStorage.setItem('checklistData', JSON.stringify(checklistData));
  }, [checklistData]);

  useEffect(() => {
  const storedData = localStorage.getItem('checklistData');
  if (storedData) {
    setChecklistData(JSON.parse(storedData));
  } else {
    setChecklistData([]); 
  }
}, []);


  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: keyof Task) => {
    const { value } = e.target;
    setChecklistData(prevData => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        [field]: value,
      };
      return newData;
    });
  };

  const handleDropDownChange = (e:any, index: number, field: keyof Task) => {
    const { value } = e.target;
    setChecklistData(prevData => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        [field]: value,
      };
      return newData;
    });
  };

  const handleAddTask = () => {
    setChecklistData(prevData => [
      ...prevData,
      {
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
      },
    ]);
    
    setRowIndex(rowIndex + 1);
    setStepNumber(prevStepNumber => prevStepNumber + 1);
  };

    const handleTaskStartedToggle = (index:any) => {
      const updatedData = [...checklistData];
      updatedData[index].startCheck = !updatedData[index].startCheck;
      setChecklistData(updatedData);
    };

    const handleTaskFinishedToggle = (index:any) => {
      const updatedData = [...checklistData];
      updatedData[index].finishCheck = !updatedData[index].finishCheck;
      setChecklistData(updatedData);
    };

    const handleDeleteTask = (index: number) => {
      setChecklistData(prevData => {
        const newData = [...prevData];
        newData.splice(index, 1); // Remove the task at the specified index
        return newData;
      });
    };

    const handleMoveTask = (index: number, direction: 'up' | 'down') => {
      setChecklistData(prevData => {
        const newData = [...prevData];
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
    
    const [insertIndex, setInsertIndex] = useState<number>(-1);
    const rightClickedTaskRef = useRef<HTMLDivElement | null>(null);

    const handleTaskRightClick = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
      e.preventDefault(); // Prevent the default right-click context menu
    
      setInsertIndex(index); // Set the index where the task should be inserted
      setShowInsertTaskButton(true); // Show the insert task button
    }

    const handleAddTaskAbove = () => {
      setChecklistData((prevData) => {
        const newData = [...prevData];
          newData.splice(insertIndex, 0, {
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
          });
          // Update the step numbers
          newData.forEach((item, idx) => {
            item.step = idx + 1;
          });
    
        return newData;
      });
    
      setInsertIndex(-1); // Reset the insertIndex
    }

    const [showInsertTaskButton, setShowInsertTaskButton] = useState(false);
    const handleCancelInsertion = () => {
      setInsertIndex(-1); // Reset the insertIndex
      setShowInsertTaskButton(false); // Hide the insert task button
    };


    const [rowIndex, setRowIndex] = useState(0);

    function handleDateChange(e: React.ChangeEvent<HTMLInputElement>, index: any, field: any) {
      const selectedDate = new Date(e.target.value);
    
      // Check if the selected date is a weekend
      if (selectedDate.getDay() === 5 || selectedDate.getDay() === 6) {
        // Find the next weekday by incrementing the date until a weekday is reached
        while (selectedDate.getDay() === 5 || selectedDate.getDay() === 6) {
          selectedDate.setDate(selectedDate.getDate() + 1);
        }
    
        const nextWeekday = selectedDate.toISOString().split('T')[0];
    
        setChecklistData(prevData => {
          const newData = [...prevData];
          newData[index] = {
            ...newData[index],
            [field]: nextWeekday,
          };
          return newData;
        });
      } else {
        const { value } = e.target;
        setChecklistData(prevData => {
          const newData = [...prevData];
          newData[index] = {
            ...newData[index],
            [field]: value,
          };
          return newData;
        });
      }
    }
    
  
    return (
    <div className=' pb-24'>
      <div className='px-8 pt-4 pb-12 border-[1px] rounded-lg bg-white'>
        <div className="">
          <div className="grid w-screen justify-start rounded-xl ">
            <div className="flex grid-cols-8 justify-start py-2 px-4 rounded-xl font-semibold text-xs text-gray-500">
            <div className="flex jusitfy-center w-[20px] rounded-lg mx-auto px-1 text-white"></div>
              <div className="w-[50px] px-4">S</div>
              <div className="w-[50px] px-4 font-bold">F</div>
              <div className="w-[400px] px-4 text-xs text-primary-blue">TASK</div>
              <div className="w-[120px] px-4 text-xs">Assigned To</div>
              {/* <div className="w-[120px] px-4 text-xs">MECH</div> */}
              <div className="w-[100px] px-4 text-xs">Duration</div>
              <div className="w-[120px] px-4 text-xs">Exp. Start</div>
              <div className="w-[120px] px-4 text-xs">Exp. Finish</div>
              <div className="w-[120px] px-4 text-xs text-primary-blue">Start</div>
              <div className="w-[120px] px-4 text-xs text-primary-blue">Finish</div>
              <div className="w-[150px] px-4 text-xs text-gray-350">REMARKS</div>
              <div className="w-[70px] px-4 text-xs text-gray-350">ES</div>
            </div>
          </div>
        </div>

        <div className="">
          <div className="grid justify-start rounded-xl overflow-hidden bg-white border-[1px]">
            {checklistData.map((item, index) => (
              <div
                key={index}
                onContextMenu={(e) => handleTaskRightClick(e, index)}
                ref={(ref) => (rightClickedTaskRef.current = ref)}
                className={`flex justify-between grid-cols-7 justify-start py-4 px-4 ${index % 2 === rowIndex % 2 ? 'bg-gray-100' : ''}`}
              >
                <div className="flex w-[20px] justify-center bg-gray-300 rounded-lg text-white">{item.step}</div>

                <div className="w-[50px] px-4">
                  <input
                    type="checkbox"
                    id={`taskStarted-${index}`}
                    checked={item.startCheck}
                    onChange={() => handleTaskStartedToggle(index)}
                  />
                  <label htmlFor={`taskStarted-${index}`} className="text-xs">
                  </label>
                </div>
                <div className="w-[50px] px-4">
                  <input
                    type="checkbox"
                    id={`taskFinished-${index}`}
                    checked={item.finishCheck}
                    onChange={() => handleTaskFinishedToggle(index)}
                  />
                </div>

                <div className='flex'>
                  <input
                    className='w-[400px] border-r-[1px] border-r-gray-350 px-4 text-xs'
                    type="text"
                    value={item.task}
                    onChange={(e) => handleTaskChange(e, index, 'task')}
                  />
                  
                  
                  <div className='pt-1 w-[120px] px-4 text-xs overflow-hidden'>
                      <select
                      value={item.lead}
                      onChange={(e) => handleDropDownChange(e, index, 'lead')}
                      className="flex justify-center items-center w-[120px] px-4 text-xs"
                    >
                      <option disabled selected value="">
                        -- Select Lead --
                      </option>
                      {hardwareLeads.map((lead, idx) => (
                        <option key={idx} value={lead}>
                          {lead}
                        </option>
                      ))}
                      {manufacturerLeads.map((lead, idx) => (
                        <option key={idx} value={lead}>
                          {lead}
                        </option>
                      ))}
                    </select>
                  </div>
                  

                  <input
                    className="w-[100px] border-r-[1px] border-r-gray-350 px-4 text-xs "
                    type="text"
                    value={item.duration + " days"} // Concatenate " days" with the duration value
                    onChange={(e) => {
                      const { value } = e.target;
                      const parsedValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                      handleDropDownChange(
                        { target: { value: parsedValue } },
                        index,
                        "duration"
                      );
                    }}
                  />
                  
                  <input
                    className='w-[120px] border-r-[1px] border-r-gray-350 px-4 text-xs'
                    type="date"
                    value={item.expectedStart}
                    onChange={(e) => handleDateChange(e, index, 'expectedStart')}
                  />
                  <input
                    className='w-[120px] border-r-[1px] border-r-gray-350 px-4 text-xs'
                    type="date"
                    value={item.expectedFinish}
                    onChange={(e) => handleDateChange(e, index, 'expectedFinish')}
                  />

                  <input
                    className='w-[120px] border-r-[1px] border-r-gray-350 px-4 text-xs text-primary-blue'
                    type="date"
                    value={item.start}
                    onChange={(e) => handleDateChange(e, index, 'start')}
                  />
                  <input
                    className='w-[120px] border-r-[1px] border-r-gray-350 px-4 text-xs text-primary-blue'
                    type="date"
                    value={item.finish}
                    onChange={(e) => handleDateChange(e, index, 'finish')}
                  />

                  <input
                    className='w-[150px] px-4 text-xs'
                    type="text"
                    value={item.remarks}
                    onChange={(e) => handleTaskChange(e, index, 'remarks')}
                  />      
                





                <div className='pt-1 w-[70px] px-4 text-xs overflow-hidden'>
                      <select
                      value={item.executingSide}
                      onChange={(e) => handleDropDownChange(e, index, 'executingSide')}
                      className="flex justify-center items-center px-4 text-xs"
                    >
                      <option disabled selected value="">
                        -- Select Executing Side --
                      </option>

                      <option value="A Enterprise">
                        A Enterprise
                      </option>
                      
                      <option value="B Enterprise">
                        B Enterprise
                      </option>
                  </select>
                </div>

                </div>

                <div className="flex px-4 items-center justify-end space-x-1">
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
                    disabled={index === checklistData.length - 1}
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

              
            ))}
            
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



          <div className="pt-4 flex justify-between ">
            <button
              onClick={handleAddTask}
              className="border-gray-300 border-2 font-bold text-xs px-12 py-2 rounded-md shadow-sm hover:shadow-none text-gray-500"
            >
              Add Task
            </button>
            <button               
              className="font-bold text-xs px-12 py-2 rounded-md shadow-sm hover:shadow-none bg-primary-blue text-white"
              onClick={saveProject}>Save Project
            </button>

          </div>
          {savingStatus && <div className='flex justify-center text-xs text-red-500'>{savingStatus}</div>}

        </div>
      </div>
    </div>
  );

}


