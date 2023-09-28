import React, { useState, useEffect } from "react";
import Candidate from "./RecruiterComponent/CandidateBox";
import axios from "axios";
import { useRecruiterContext } from "../../contexts/recruiterPage1-2";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import JobDetailBox from "./RecruiterComponent/JobDetailBox";
import { Spinner, Skeleton } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { RadioCandidate } from "./RecruiterComponent/Recruiter-1-2-Component";
import backArrow from "../../assets/recruiter-2/arrow-left-icon.svg";

function ShowJobPosting() {
  const param = useParams();
  const { candidateFilterState } = useRecruiterContext();
  let data = {
    job_id: param.id,
    job_user_mark: candidateFilterState,
  };
  function sortByStatus(a, b) {
    if (a.job_user_mark < b.job_user_mark) {
      return 1;
    }
    if (a.job_user_mark > b.job_user_mark) {
      return -1;
    }
    return 0;
  }
  const {
    data: job,
    error: errorR,
    loading: loadingR,
    refetch: refetchR,
  } = useQuery({
    queryKey: ["jobs", data],
    queryFn: async (data) => {
      const response = await axios.post(
        "http://localhost:4000/recruiter-display/getjob",
        data.queryKey[1]
      );
      return response.data;
    },
  });
  async function getCandidate(data) {
    const response = await axios.post(
      "http://localhost:4000/recruiter-display/getcandidate",
      data.queryKey[1]
    );
    return response.data.data;
  }
  const {
    data: candidates,
    error,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["candidates", data],
    queryFn: async (data) => {
      return getCandidate(data);
    },
  });
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full">
        <Spinner color="pink.200" size="lg" />
      </div>
    );
  }
  if (error) {
    return <div>Error Loading</div>;
  }
  candidates?.sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });
  candidates?.sort(sortByStatus);

  return (
    <ShowJobContainer>
      <Link to={`/`}>
        <BackButton>
          <img src={backArrow} />
          Back
        </BackButton>
      </Link>
      <p className="text-[35px] font-[Montserrat] mt-[21.33]">
        Show Job Posting
      </p>
      {job?.map((item, key) => {
        return <JobDetailBox key={key} datas={item} refreshData={refetchR} />;
      })}
      <RadioCandidate />
      <p className="text-[21px] font-[Montserrat] font-medium mt-[16px]">
        {candidates?.length} candidates found
      </p>
      {candidates?.map((item, key) => {
        return (
          <Candidate
            key={key}
            datas={item}
            refreshData={refetch}
            jobRefreshData={refetchR}
          />
        );
      })}
    </ShowJobContainer>
  );
}

export default ShowJobPosting;

function ShowJobContainer({ children }) {
  return (
    <div className="w-[1259px] flex flex-col  items-start font-[Inter] ml-[160px] mr-[160px] pt-[32px]">
      {children}
    </div>
  );
}
function BackButton({ children }) {
  return (
    <button className="flex flex-row text-[#616161] text-[15px] font-medium">
      {children}
    </button>
  );
}
