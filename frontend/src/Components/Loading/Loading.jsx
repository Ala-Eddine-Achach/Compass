import { useNavigate } from 'react-router-dom'
import './loading.css'
import { funFacts } from '../../data/FunFactsData';
import { useState } from 'react';

export default function Loading({path}) {
    const navigate = useNavigate();
    const [randomFact, setRandomFact] =useState( funFacts[Math.floor(Math.random() * funFacts.length)]);

    return (<>
        <div className="spinner-container-submit">
            <div className="spinner"></div>
            <div className='loading-description '>
                <h1 style={{
                    fontSize: '1.5rem', fontWeight: 'bold', color: 'black', marginBottom: '0.5rem'
                }}>
                    Fun fact while waiting:  
                </h1>
                <h3 style={{
                    fontSize: '1rem', fontWeight: 'bold', color: 'black', marginBottom: '0.5rem'
                }}>
                    Category: {randomFact.category} 
                </h3>
                <p style={{
                    marginBottom: '0.5rem'
                }}
                >{randomFact.fact}</p>
                <div>
                {/* <button className='btn btn-outline-danger m-1' onClick={()=> navigate(path)}>Skip</button> */}
                <button className='btn btn-outline-success m-1' onClick={()=> setRandomFact(funFacts[Math.floor(Math.random() * funFacts.length)])}>More</button>

                </div>
                    

            </div>
        </div>
        
        </>
    )
}
