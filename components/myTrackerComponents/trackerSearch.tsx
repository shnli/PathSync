import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DisplayOldProjects from './displayOldProjects';
import axios from 'axios';
import Link from 'next/link';


export default function SearchTracker() {
  const [showOldProject, setShowOldProject] = useState(false);
  const [projects, setProjects] = useState<{
    id: number;
    name: string;
    purchaseOrderCode: string;
    productModel: string;
    orderDate: string;
    orderQuantity: string;
    projectStartDate:string;
    
    }[]>([]);

    // const [tasks, setTasks] = useState([]);
    
    const [trackerSearch, setTrackerSearch] = useState({
        PMSearch: '',
        POSearch: '',
    });
    
    const router = useRouter();
    useEffect(() => {
        // Fetch projects
        axios
        .get('/api/getallprojects')
        .then((response) => {
        const projectsWithOrderDate = response.data.map((project: any) => ({
            ...project,
            orderDate: project.orderDate, 
            orderQuantity: project.orderQuantity, 
            startDate: project.startDate,
            id: project.id
        }));
        setProjects(projectsWithOrderDate);
        console.log('Success');        

        })
        .catch((error) => console.error('Error retrieving projects:', error));
    
    }, []);

  const handlePOChange = (e: any) => {
    const { name, value } = e.target;
    setTrackerSearch((prevTrackerSearch) => ({
      ...prevTrackerSearch,
      POSearch: value,
    }));
  };

  const handlePMChange = (e: any) => {
    const { name, value } = e.target;
    setTrackerSearch((prevTrackerSearch) => ({
      ...prevTrackerSearch,
      PMSearch: value,
    }));
  };

  const handleNextClick = (e: any) => {
    e.preventDefault();
    if (trackerSearch.POSearch && trackerSearch.PMSearch) {
      setShowOldProject(true);
    } else {
      alert('Please Search a Product Model and Purchase Order');
    }
  };

  //////////////////////////////

  // const handleDeleteProject = async (index: number) => {
  //   const projectToDelete = projects[index];
  
  //   try {
  //     await axios.post('/api/deleteproject', { id: projectToDelete.id }); // Pass 'id' instead of 'taskId'
  //     setProjects(prevProject => {
  //       const newProjects = [...prevProject];
  //       newProjects.splice(index, 1); // Remove the task at the specified index
  //       return newProjects;
  //     });
  //     console.log('Project deleted successfully!');
  //   } catch (error) {
  //     console.error('Error deleting project:', error);
  //   }
  // };

  // const handleDeleteProject = async (projectId:any) => {
  //   try {
  //     await axios.post('/api/deleteproject', { id: projectId });
  //     setProjects(prevProjects => {
  //       // Filter out the project with the matching ID
  //       return prevProjects.filter(project => project.id !== projectId);
  //     });
  //     console.log('Project deleted successfully!');
  //   } catch (error) {
  //     console.error('Error deleting project:', error);
  //   }
  // };
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

  
  
  const handleDeleteProject = async (index: number) => {
    const projectToDelete = projects[index];

    try {
      const response = await axios.get(`/api/getalltasksforaproject?id=${projectToDelete.id}`)
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
            console.log('Tasks fetched successfully');
          } catch (error) {
            console.error('Error retrieving tasks:', error);
          }

    //delete all tasks in the project first
    for(let i = 0; i < tasks.length; i++){
      const taskToDelete = tasks[i];
      try {
        await axios.post('/api/deletetask', { id: taskToDelete.id }); // Pass 'id' instead of 'taskId'
        setTasks(prevTasks => { 
          const newTasks = [...prevTasks];
          newTasks.splice(index, 1); // Remove the task at the specified index
          return newTasks;
        });
        console.log('Task deleted successfully!');
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
    
    try {
      await axios.post('/api/deleteproject', { id: projectToDelete.id }); // Pass 'id' instead of 'taskId'
      setProjects(prevProjects => {
        const newProjects = [...prevProjects];
        newProjects.splice(index, 1); // Remove the task at the specified index
        return newProjects;
      });
      console.log('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting Project:', error);
    }
  };
// const handleDeleteProject = (index: number) => {
//   setProjects(prevData => {
//     const newData = [...prevData];
//     newData.splice(index, 1); // Remove the task at the specified index
//     return newData;
//   });
// };

  
  const renderProjects = () => {
    return (
      <>
        <div className='grid '>
          <div className='grid grid-cols-7 font-bold pb-2 p-4 text-gray-500'>
            {/* <div className=''></div> */}
            <div className='text-primary-blue'>Product Model</div>
            <div>Purchase Order</div>
            <div>Order Date</div>
            <div>Quantity</div>
          </div>
  
          <div className='pt-2 space-y-'>
          {/* {sortedTasks.map((task: any, index: number) => ( */}

            {projects.slice().reverse().map((project:any, index:number) => (
              <div key={project.id} className=''> 
                <div className='grid grid-cols-7 my-1 border-[1px] rounded-lg px-4 py-2 bg-white'>
                      {/* <div> {project.id}</div> */}
                      <div className='text-primary-blue'>{project.productModel}</div>
                      <div>{project.purchaseOrderCode}</div>
                      <div>{project.orderDate}</div>
                      <div className='px-6'>{project.orderQuantity}</div>
                      
                      <Link
                        className='flex justify-end align-center text-primary-blue hover:underline font-semibold text-sm'
                        href={{
                        pathname: '/myTrackerAnalytics',
                        query: {
                            id: project.id,
                            purchaseOrderCode: project.purchaseOrderCode,
                            productModel: project.productModel,
                            orderDate: project.orderDate,
                            orderQuantity: project.orderQuantity,
                            projectStartDate: project.projectStartDate,
                        },
                        }}>
                        Analytics
                      </Link>

                      <Link
                        className='flex justify-end align-center text-primary-blue hover:underline text-sm'
                        href={{
                        pathname: '/myTrackerSubpage',
                        query: {
                            id: project.id,
                            purchaseOrderCode: project.purchaseOrderCode,
                            productModel: project.productModel,
                            orderDate: project.orderDate,
                            orderQuantity: project.orderQuantity,
                            projectStartDate: project.projectStartDate,
                        },
                        }}>
                        Edit
                      </Link>

                    <div className='flex justify-end'>
                        <button onClick={() => handleDeleteProject(index)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="red" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
    <div className="mb-8">
      <label htmlFor="model" className="block mb-1 font-medium text-gray-500">
        Search Projects *Under Construction
      </label>
      <div className="flex gap-4 w-full pb-8">
        <input
          placeholder="Product Model Code"
          required
          value={trackerSearch.PMSearch}
          id="PMSearch"
          type="text"
          className="px-8 py-3 border rounded-lg focus:outline-none focus:border-blue-500 text-sm"
          onChange={handlePMChange}
        />

        <input
          placeholder="Purchase Order Code"
          required
          value={trackerSearch.POSearch}
          id="POSearch"
          type="text"
          className="px-8 py-3 border rounded-lg focus:outline-none focus:border-blue-500 text-sm"
          onChange={handlePOChange}
        />

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={handleNextClick}
        >
          Search
        </button>
      </div>

      {showOldProject && (
        <DisplayOldProjects
          trackerSearch={trackerSearch}
          productModel={[trackerSearch.PMSearch]}
          purchaseOrder={[trackerSearch.POSearch]}
        />
      )}

      {renderProjects()}
    </div>
  );
}
