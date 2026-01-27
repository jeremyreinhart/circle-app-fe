// import { api } from "@/services/api";
// import { useState } from "react";

// type FollowUser = {
//   id: number;
//   username: string;
//   name: string;
//   avatar?: string;
//   is_following?: boolean; // hanya ada di followers
// };

// export const Follows = () => {
//     const [tab,setTab] = useState<'followers' | 'following'>('followers')
//     const [users,Setusers] = useState<FollowUser[]>([])
//     const [loading,setLoading] = useState(false)

//     cosnt fetchFollows = async () => {
//         setLoading(true)
//         try {
//             const response = await api.get(`/follows/?tab=${tab}`, {withCredentials:true})
//         } catch (error) {

//         }
//     }
//     return(

//     )
// };
