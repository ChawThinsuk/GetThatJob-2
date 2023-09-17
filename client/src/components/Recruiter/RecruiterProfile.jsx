import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Button,
  Text,
  InputGroup,
  InputLeftAddon,
  FormHelperText,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useGlobalContext } from "../../contexts/registerContext.jsx";
import axios from "axios";
import UploadPdf from "../register/UploadPdf.jsx";
import { useAuth } from "../../contexts/Authorization.jsx";
import uploadlogo from "../../assets/register-images/pdf-upload.svg";

export function RecruiterProfile() {
  const { profFormStyle, userType } = useGlobalContext();
  const [companyName, setCompanyName] = useState("");
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [recruiterPassword, setRecruiterPassword] = useState("");
  const [recruiterpasswordConfirmation, setRecruiterPasswordConfirmation] =
    useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [aboutCompany, setAboutCompany] = useState("");
  const [logo, setLogo] = useState("");
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [formattedUpdatedTime, setFormattedUpdatedTime] = useState("");
  const { state } = useAuth();
  const toast = useToast();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check for allowed file types (JPG and PNG)
      if (/(jpg|jpeg|png)$/i.test(file.type) && file.size <= 5 * 1024 * 1024) {
        setLogo(file);
        setSelectedFileName(file.name);
      } else {
        setLogo(null);
        setSelectedFileName(null);
        toast({
          title: "Wrong file type or size",
          description: "Please upload a JPG or PNG file under 5MB.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      // No file selected, clear the selected file and file name
      setLogo(null);
      setSelectedFileName(null);
    }
  };

  const getRecfProfile = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/aoo/getrecruiter",
        { id: state.userID }
      );

      const updatedTime = response.data.data.updated_at;
      const date = new Date(updatedTime);
      const newFormattedUpdatedTime = `${date
        .toISOString()
        .slice(0, 10)} at ${date.toLocaleTimeString()}`;

      const { data } = response;

      const {
        recruiter_id,
        company_name,
        company_email,
        company_description,
        company_website,
        logo,
        user_id,
      } = data.data;

      setCompanyName(data.data.company_name);
      setAboutCompany(data.data.company_description);
      setRecruiterEmail(data.data.company_email);
      setCompanyWebsite(data.data.company_website);
      setLogo(data.data.logo);
      setSelectedFileName(data.data.logo);
      setFormattedUpdatedTime(newFormattedUpdatedTime);
      // console.log(logo);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Prepare the updated profile data object
      const updatedRecData = {
        company_email: recruiterEmail,
        company_name: companyName,
        company_website: companyWebsite,
        company_description: aboutCompany,
      };

      // Make a PUT request to update the profile data
      await axios.put(
        `http://localhost:4000/aoo/getrecruiter/${state.userID}`,
        updatedRecData
      );

      // Display a success message to the user
      toast({
        title: "Profile updated successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      // Handle any errors that may occur during the update process
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description:
          "An error occurred while updating your profile. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    getRecfProfile();
  }, []);
  return (
    <ChakraProvider>
      <div className="flex pl-[160px] font-[Inter]">
        <Box w="100%" maxW="lg" mt={10} borderRadius="md">
          <h1 className="text-[45px] font-[Montserrat] mb-4">Profile</h1>
          <div className="flex mb-[11px]">
            <div className="w-[100px] h-[100px]  rounded-2xl shadow-lg">
              <img src={logo} alt="" />
            </div>
            <div className="ml-2 flex flex-col">
              <p className="mb-3 text-[#373737] text-[13px] tracking-[1.5px] uppercase">
                company logo
              </p>
              {/* <UploadPdf /> */}
              <div>
                <div className="mx-auto bg-white rounded-lg flex">
                  <input
                    type="file"
                    id="pdf-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="pdf-upload"
                    className="cursor-pointer flex items-center justify-center w-[160px] h-auto p-[13px] rounded-xl bg-[#F48FB1] text-white hover:bg-pink-600 transition duration-300"
                  >
                    <img src={uploadlogo} className="pr-2" alt="logo" />
                    Choose a file
                  </label>

                  {selectedFileName ? (
                    <div className="mt-4 ml-4">
                      <p>
                        File selected:{" "}
                        {selectedFileName.substring(
                          selectedFileName.length - 12
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="ml-4 mt-3">
                      <p>No file chosen</p>
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-2 text-[#8E8E8E]">
                Only JPG,JPEG,PNG. Max size 5MB
              </p>
            </div>
          </div>
          <form>
            <Stack spacing={4}>
              <FormControl id="recruiterEmail" isRequired>
                <FormLabel sx={profFormStyle}>COMPANY EMAIL</FormLabel>
                <Input
                  borderColor="#F48FB1"
                  type="email"
                  placeholder="Enter your email address"
                  value={recruiterEmail}
                  onChange={(event) => {
                    setRecruiterEmail(event.target.value);
                  }}
                />
              </FormControl>
              <FormControl id="companyName" isRequired>
                <FormLabel sx={profFormStyle}>COMPANY NAME</FormLabel>
                <Input
                  borderColor="#F48FB1"
                  type="name"
                  placeholder="Enter your company name"
                  value={companyName}
                  onChange={(event) => {
                    setCompanyName(event.target.value);
                  }}
                />
              </FormControl>
              {/* <FormControl id="recruiterPassword" isRequired>
                <FormLabel sx={customTextStyle}>Password</FormLabel>
                <Input
                  borderColor="#F48FB1"
                  type="password"
                  placeholder="Enter your password"
                  value={recruiterPassword}
                  onChange={(event) => {
                    setRecruiterPassword(event.target.value);
                  }}
                />
              </FormControl>
              <FormControl id="recruiterPasswordConfirm" isRequired>
                <FormLabel sx={customTextStyle}>
                  Password Confirmation
                </FormLabel>
                <Input
                  borderColor="#F48FB1"
                  type="password"
                  placeholder="Enter your password"
                  value={recruiterpasswordConfirmation}
                  onChange={(event) => {
                    setRecruiterPasswordConfirmation(event.target.value);
                  }}
                />
              </FormControl> */}
              <FormControl id="companyWebsite" isRequired>
                <FormLabel sx={profFormStyle}>Company Website</FormLabel>
                <Input
                  borderColor="#F48FB1"
                  type="url"
                  placeholder="Enter your company url"
                  value={companyWebsite}
                  onChange={(event) => {
                    setCompanyWebsite(event.target.value);
                  }}
                />
              </FormControl>
              <FormControl id="companyInfo" isRequired>
                <FormLabel sx={profFormStyle}>About the company</FormLabel>
                <Textarea
                  w="1013px"
                  h="229px"
                  borderColor="#F48FB1"
                  type="text"
                  placeholder="Enter your company info"
                  value={aboutCompany}
                  onChange={(event) => {
                    setAboutCompany(event.target.value);
                  }}
                />
              </FormControl>
            </Stack>
            <p className="mt-2 text-[#8E8E8E] text-[16px]">
              Last Updated: {formattedUpdatedTime}
            </p>
            <Button
              letterSpacing="2px"
              w="220px"
              h="53px"
              mt={8}
              mb={8}
              type="button"
              bg="#F48FB1"
              variant="solid"
              size="sm"
              fontSize="19px"
              color="white"
              borderRadius="19px"
              onClick={handleSaveChanges}
            >
              UPDATE PROFILE
            </Button>
          </form>
        </Box>
      </div>
    </ChakraProvider>
  );
}
/*  */
