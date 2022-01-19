import React, { useState, useEffect, Fragment, useRef, useCallback } from 'react';
import styled from "styled-components";

interface AirLineInterFace {
  country: string
  established: string
  head_quaters: string
  id: number
  logo: string
  name: string
  slogan: string
  website: string
}

interface PassengerInterFace {
  airline: AirLineInterFace[]
  name: string
  trips: number
  _id: string
}

function Passenger() {
  const observerRef = useRef<HTMLDivElement|null>(null);
  const [data, setData] = useState<PassengerInterFace[]>([]);
  const [page, setPage] = useState(1);
  
  const getData = async (page: number) => {
    console.log("page", page)
    const data = await fetch(`https://api.instantwebtools.net/v1/passenger?page=${page}&size=${10}`)
    const fetchedData = await data.json();
    setData(fetchedData.data);
    setPage(page + 1);
  }
  
  const observerCallback = useCallback((e: any) => {
    console.log("d", page)
    if(e[0].isIntersecting){
      getData(page)
    }
  }, [page])
  const [observer, setObserver] = useState(new IntersectionObserver(observerCallback, {
    threshold: 0
  }))
  const getLists = () => {
    return data.map((user) => (
      <Fragment key={user._id}>
        <CardHead>
          <span className="username">{user.name}</span>
          <span className="trips">{(user.trips && user.trips) || 0} trips</span>
        </CardHead>
        <CardBody>
          <CardImg src={user.airline[0].logo} />
          <CardContent>{user.airline[0].slogan}</CardContent>
        </CardBody>
        <CardId>{user._id}</CardId>
      </Fragment>
      
    ))
}
  useEffect(()=>{
    if(observerRef && observerRef.current){
      observer.observe(observerRef.current)
    }
  }, [observerRef, observer])

  return (
      <Main>
        <h2>Passenger List</h2>
        <CardWrapper>
        {getLists()}
        </CardWrapper>
        <ObserverBox ref={observerRef}/>
      </Main>
  );
}

export default Passenger;

const Main = styled.div`
  padding: 20px;
`;

const CardWrapper = styled.div`
  width: 100%;
  height: auto;
`
const CardHead = styled.div`
  border-top: 1px solid rgb(241, 243, 249);
  display: flex;
  justify-content: space-between;
  padding-top: 20px;

  .username {
    font-size: 16px;
    font-weight: bold;
  }
  .trips {
    font-size: 12px;
    font-weight: 600;
  }
`

const CardBody = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding: 20px;
  background-color: #eee;
`

const CardImg = styled.img`
  width: 80px;
`

const CardContent = styled.div`
  font-size: 14px;
  margin-left: 10px;
`

const CardId = styled.div`
  text-align: right;
  font-size: 12px;
  font-weight: bold;
  color: #ccc;
  padding: 20px 0px;
`

const ObserverBox = styled.div`
  width: 1px;
  height: 1px;
`