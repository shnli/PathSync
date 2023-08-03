import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DisplayOldProjects from './displayOldProjects';
import axios from 'axios';
import Link from 'next/link';


export default function SearchTracker() {
  const [loadStatus, setLoadStatus] = useState<string>('');

  const [showOldProject, setShowOldProject] = useState(false);
  const [projects, setProjects] = useState<{
    id: number;
    name: string;
    purchaseOrderCode: string;
    productModel: string;
    orderDate: string;
    orderQuantity: string;
    projectStartDate:string;
    
    status: boolean

    
    }[]>([]);

  
  const router = useRouter();
  
  const [userId, setUserId] = useState<number | null>(null);
    
  const getUserData = async () => {
    setLoadStatus("Loading...")
    try {
      const storedEmail = localStorage.getItem("email");
      const storedPassword = localStorage.getItem("password");

      if (!storedEmail) {
        router.push("/login");
      } else {
        const response = await axios.post('/api/auth/me', { email: storedEmail , password: storedPassword });
        const userData = response.data;
        console.log(userData.id);
        setUserId(userData.id);
      }
    } catch (error) {
      console.error('Hello Error fetching user data:', error);
    }
  };

  useEffect(() => {
    getUserData();
    }, []);


  useEffect(() => {
    if (userId) {
      // Fetch projects using the userId
      console.log(userId);
  
      axios
        .get(`/api/getallprojects?userId=${userId}`)
        .then((response) => {
          const projectsWithOrderDate = response.data.map((project: any) => ({
            ...project,
            orderDate: project.orderDate,
            orderQuantity: project.orderQuantity,
            startDate: project.startDate,
            id: project.id,
          }));
          setProjects(projectsWithOrderDate);
          console.log('Success');
          setLoadStatus("");
        })
        .catch((error) => {
          console.error('HELLO Error retrieving projects:', error);
          setLoadStatus("Error retrieving projects, please try again.");
        });
    }
  }, [userId]);

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

  
  const [deletionStatus, setDeletionStatus] = useState<string>('');

  const handleDeleteProject = async (index: number) => {
    setDeletionStatus("Deleting...")
    const projectIndex = index ;
    const projectToDelete = projects[projectIndex];

    const confirmed = window.confirm(`Are you sure you want to delete ${projectToDelete.productModel}, ${projectToDelete.purchaseOrderCode}? These changes can not be reversed.`);
    if (!confirmed) {
      return; // User canceled the deletion
    }
  
    try {
      const response = await axios.get(`/api/getalltasksforaproject?id=${projectToDelete.id}`);
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
  
    // Delete all tasks in the project first
    try {
      await Promise.all(tasks.map(async (task) => {
        await axios.post('/api/deletetask', { id: task.id });
        console.log('Task deleted successfully!');
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  
    // Now delete the project
    try {
      await axios.post('/api/deleteproject', { id: projectToDelete.id });
      setProjects(prevProjects => {
        const newProjects = [...prevProjects];
        newProjects.splice(index, 1); // Remove the project at the specified index
        return newProjects;
      });
      setDeletionStatus("Project deleted successfully!")
      console.log('Project deleted successfully!');
    } catch (error) {
      setDeletionStatus("Error deleting project, please try again.")
      console.error('Error deleting Project:', error);
    }
  };

  const [checkedProjects, setCheckedProjects] = useState<number[]>([]);

  useEffect(() => {
    const storedCheckedProjects = localStorage.getItem('checkedProjects');
    if (storedCheckedProjects) {
      setCheckedProjects(JSON.parse(storedCheckedProjects));
    }
  }, []);

  // Save the checkbox state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('checkedProjects', JSON.stringify(checkedProjects));
    console.log(JSON.stringify(checkedProjects))
  }, [checkedProjects]);

  const handleCheckboxChange = (projectId: number) => {
    setCheckedProjects((prevCheckedProjects) => {
      if (prevCheckedProjects.includes(projectId)) {
        // Create a new array without the projectID
        const updatedProjects = prevCheckedProjects.filter((id) => id !== projectId);
        return updatedProjects;
      } else {
        // Create a new array with the added projectID
        const updatedProjects = [...prevCheckedProjects, projectId];
        return updatedProjects;
      }
    });
  };  
  
  const [flaggedProjects, setFlaggedProjects] = useState<number[]>([]);
  useEffect(() => {
    const storedFlaggedProjects = localStorage.getItem('flaggedProjects');
    if (storedFlaggedProjects) {
      setFlaggedProjects(JSON.parse(storedFlaggedProjects));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('flaggedProjects', JSON.stringify(flaggedProjects));
  }, [flaggedProjects]);

  const handleFlagChange = (projectId: number) => {
    setFlaggedProjects((prevFlaggedProjects) => {
      if (prevFlaggedProjects.includes(projectId)) {
        // Create a new array without the projectID
        const updatedFlaggedProjects = prevFlaggedProjects.filter((id) => id !== projectId);
        return updatedFlaggedProjects;
      } else {
        // Create a new array with the added projectID
        const updatedFlaggedProjects = [...prevFlaggedProjects, projectId];
        return updatedFlaggedProjects;
      }
    });
  };  

  const isProjectFlagged = (projectId: number) => {
    return flaggedProjects.includes(projectId);
  };

  const renderProjects = () => {
    
    if (projects.length === 0) {
      return <div className="text-center lg:text-2xl opacity-30 font-semibold text-blue-600 mt-24">No projects in your database, click the &ldquo;New +&rdquo; button to add a new project!</div>;
    }
    return (
      <>
        <div className='grid '>
          <div className='grid grid-cols-12 font-bold pb-2 p-4 text-gray-500'>
            {/* <div className=''></div> */}
            <div className="flex justify-start">
                Status
            </div>
            <div className='flex justify-start text-primary-blue col-span-4'>Project Name</div>
            <div className='flex justify-start col-span-2'>Project Code</div>
            <div className='flex justify-center'>Order Date</div>
            <div className='flex justify-center'>Quantity</div>
          </div>

          <div className='pt-2 '>
            {projects.slice().reverse().map((project:any, index:number) => (
              <div key={project.id} className=''> 
                <div className={`flex items-center grid grid-cols-12 my-1 border-[1px] rounded-lg px-4 py-2  ${isProjectFlagged(project.id) ? 'bg-gray-300' : 'bg-white'}`}>
                      {/* <div> {project.id}</div> */}
                      <div className='flex gap-4'>
                        <div className="flex justify-center items-center" >
                          <input               
                          className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-blue-300 h-4 w-4 rounded"
                          id={`project_${project.id}`}
                          aria-describedby={`project_${project.id}`}
                          type="checkbox"
                          checked={checkedProjects.includes(project.id)}
                          onChange={() => handleCheckboxChange(project.id)}>
                          </input>
                        </div>
                        
                        <div className="flex justify-center items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" 
                          fill={isProjectFlagged(project.id) ? 'red' : 'white'}
                          viewBox="0 0 24 24" 
                          stroke-width="1.5" 
                          stroke="currentColor" 
                          className="w-6 h-6 opacity-80" 
                          onClick={() => handleFlagChange(project.id)}
                          >
                            <path d="M5 21V3.90002C5 3.90002 5.875 3 8.5 3C11.125 3 12.875 4.8 15.5 4.8C18.125 4.8 19 3.9 19 3.9V14.7C19 14.7 18.125 15.6 15.5 15.6C12.875 15.6 11.125 13.8 8.5 13.8C5.875 13.8 5 14.7 5 14.7" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                      </div>


                      </div>
                      <Link
                        className='flex hover:underline font-bold flex justify-start col-span-4'
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
                        <div className=''>{project.productModel}</div>
                      </Link>
                      <div className='flex justify-start col-span-2'>{project.purchaseOrderCode}</div>
                      <div className='flex justify-center'>{project.orderDate}</div>
                      <div className='flex justify-center px-6'>{project.orderQuantity}</div>
                      
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
                        <button onClick={() => handleDeleteProject(projects.length - 1 - index)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="red" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    </div>   
                  </div>
              </div>
            ))}
            <div className= "flex justify-center items-center text-xs text-red-500 pt-4">
            {deletionStatus}
            </div>
          </div>
        </div>
      </>
    );
  };
  

  return ( 
    <div className="mb-8">
      {/* <label htmlFor="model" className="block mb-1 font-medium text-gray-500">
        Search Projects *Under Construction
      </label> */}
      {/* <div className="flex gap-4 w-full pb-8"> */}
        {/* <input
          placeholder="Project Name Code"
          required
          value={trackerSearch.PMSearch}
          id="PMSearch"
          type="text"
          className="px-8 py-3 border rounded-lg focus:outline-none focus:border-blue-500 text-sm"
          onChange={handlePMChange}
        />

        <input
          placeholder="Project Code Code"
          required
          value={trackerSearch.POSearch}
          id="POSearch"
          type="text"
          className="px-8 py-3 border rounded-lg focus:outline-none focus:border-blue-500 text-sm"
          onChange={handlePOChange}
        /> */}

        {/* <button
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
      )} */}
      <div className="text-xs flex justify-center items-center text-primary-blue">
        {loadStatus}
      </div>
      {renderProjects()}
    </div>
  );
}
