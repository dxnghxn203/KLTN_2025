import axiosClient from "@/utils/configs/axiosClient";
export const insertUser  = async (params: any) : Promise<any>=> {
    try {
    const url = "/v1/user/register_email";
    console.log("param:",params);
    const paramsReq = {
        "phone_number": params.phoneNumber,
        "user_name": params.username,
        "email": params.email,
        "password": params.password,
        "gender": params.gender,
        "birthday": params.dateOfBirth
      }
    
    const result = await axiosClient.post(url, paramsReq);
    console.log("Result",result )
    return result;
} catch (error) {
    throw error;
}
}
