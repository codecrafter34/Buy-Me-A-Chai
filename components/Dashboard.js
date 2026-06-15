"use client"
import React, { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { fetchuser, updateProfile, setUserRole, fetchVideosByCreator, deleteVideo } from '@/actions/useractions'
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
const Dashboard = () => {
    const { data: session, update } = useSession()
    const router = useRouter()
    const [form, setform] = useState({})
    const [profilePreview, setProfilePreview] = useState("")
    const [coverPreview, setCoverPreview] = useState("")
    const [uploading, setUploading] = useState({ profile: false, cover: false })
    const [videoFile, setVideoFile] = useState(null)
    const [videoPreview, setVideoPreview] = useState("")
    const [videoUploading, setVideoUploading] = useState(false)
    const [videoUrl, setVideoUrl] = useState("")
    const [previewFile, setPreviewFile] = useState(null)
    const [previewVideoPreview, setPreviewVideoPreview] = useState("")
    const [previewUploading, setPreviewUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState("")
    const [videoForm, setVideoForm] = useState({ title: "", description: "", price: "" })
    const [creatorVideos, setCreatorVideos] = useState([])

    useEffect(() => {
        getData()
        
    if (!session) {
            router.push('/login')
        }
       
    }, [router,session])
    

    const getData = async () => {
        // console.log(session)
        let u = await fetchuser(session.user.name)
        setform(u)
        let vids = await fetchVideosByCreator(session.user.name)
        setCreatorVideos(vids)
    }

    const handleDeleteVideo = async (videoId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this video?")
        if (!confirmDelete) return
        
        const res = await deleteVideo(videoId, session.user.name)
        if (res.success) {
            toast("Video deleted successfully", {
                position: "top-right",
                autoClose: 4000,
                theme: "light",
            })
            getData()
        } else {
            toast.error(res.message || "Failed to delete video", {
                position: "top-right",
                autoClose: 5000,
            })
        }
    }

    const handleChange = (e) => {
        setform({...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {

        let a = await updateProfile(e, session.user.name)
        toast('Profile Updated', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            });
        if (a?.success) {
            router.push(`/${session.user.name}`)
        }
    }

    const handleProfileSelect = (e) => {
        const file = e.target.files?.[0]
        if (!file) {
            return
        }
        setProfilePreview(URL.createObjectURL(file))
        uploadImage(file, "profile")
    }

    const handleCoverSelect = (e) => {
        const file = e.target.files?.[0]
        if (!file) {
            return
        }
        setCoverPreview(URL.createObjectURL(file))
        uploadImage(file, "cover")
    }

    const uploadImage = async (file, imageType) => {
        setUploading((prev) => ({ ...prev, [imageType]: true }))
        const body = new FormData()
        body.append("file", file)
        body.append("type", imageType)

        const res = await fetch("/api/upload", {
            method: "POST",
            body: body,
        })

        const data = await res.json()
        if (!res.ok || !data?.success) {
            toast.error(data?.message || "Upload failed", {
                position: "top-right",
                autoClose: 5000,
            })
            setUploading((prev) => ({ ...prev, [imageType]: false }))
            return
        }

        setform((prev) => ({
            ...prev,
            ...(imageType === "profile" ? { profilepic: data.imageUrl } : { coverpic: data.imageUrl }),
        }))
        toast("Image uploaded successfully", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            transition: Bounce,
        })
        setUploading((prev) => ({ ...prev, [imageType]: false }))
    }

    const handleVideoChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) {
            return
        }
        setVideoFile(file)
        setVideoPreview(URL.createObjectURL(file))
    }

    const handleVideoFormChange = (e) => {
        setVideoForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const uploadVideo = async () => {
        if (!videoFile) {
            toast.error("Please select a video", {
                position: "top-right",
                autoClose: 4000,
            })
            return
        }

        if (!videoForm.title || !videoForm.price) {
            toast.error("Title and price are required", {
                position: "top-right",
                autoClose: 4000,
            })
            return
        }

        setVideoUploading(true)
        const body = new FormData()
        body.append("file", videoFile)

        const res = await fetch("/api/upload-video", {
            method: "POST",
            body: body,
        })

        const data = await res.json()
        if (!res.ok || !data?.success) {
            toast.error(data?.message || "Video upload failed", {
                position: "top-right",
                autoClose: 5000,
            })
            setVideoUploading(false)
            return
        }

        setVideoUrl(data.videoUrl)

        const saveRes = await fetch("/api/videos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: videoForm.title,
                description: videoForm.description,
                price: videoForm.price,
                videoUrl: data.videoUrl,
                previewUrl: previewUrl,
            }),
        })

        const saveData = await saveRes.json()
        if (!saveRes.ok || !saveData?.success) {
            toast.error(saveData?.message || "Video save failed", {
                position: "top-right",
                autoClose: 5000,
            })
            setVideoUploading(false)
            return
        }
        toast("Video uploaded successfully", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            transition: Bounce,
        })
        setVideoUploading(false)
        setVideoForm({ title: "", description: "", price: "" })
        setVideoFile(null)
        setVideoPreview("")
        setVideoUrl("")
        getData()
    }

    const handlePreviewChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) {
            return
        }
        setPreviewFile(file)
        setPreviewVideoPreview(URL.createObjectURL(file))
    }

    const uploadPreviewVideo = async () => {
        if (!previewFile) {
            toast.error("Please select a preview video", {
                position: "top-right",
                autoClose: 4000,
            })
            return
        }

        setPreviewUploading(true)
        const body = new FormData()
        body.append("file", previewFile)

        const res = await fetch("/api/upload-video", {
            method: "POST",
            body: body,
        })

        const data = await res.json()
        if (!res.ok || !data?.success) {
            toast.error(data?.message || "Preview upload failed", {
                position: "top-right",
                autoClose: 5000,
            })
            setPreviewUploading(false)
            return
        }

        setPreviewUrl(data.videoUrl)
        toast("Preview uploaded successfully", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            transition: Bounce,
        })
        setPreviewUploading(false)
    }

    const handleBecomeCreator = async () => {
        await signOut({ callbackUrl: '/login?mode=creator' })
    }





    const isCreator = session?.user?.role === "creator"

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
         
            <ToastContainer />
            <div className='container mx-auto py-5 px-2 md:px-6 '>
                <h1 className='text-center my-5 text-3xl font-bold'>Welcome to your Dashboard</h1>

                {!isCreator && (
                    <div className="max-w-2xl mx-auto mb-4 flex justify-end">
                        <button
                            type="button"
                            onClick={handleBecomeCreator}
                            className="px-4 py-2 text-sm rounded-lg bg-lime-400 text-black font-medium hover:bg-lime-500"
                        >
                            Become a Creator
                        </button>
                    </div>
                )}

                {!isCreator && (
                    <div className="max-w-2xl mx-auto mb-6 p-4 border border-gray-800 rounded-lg text-sm text-gray-300">
                        Only creators can edit profile and upload content. Click “Become a Creator” to unlock.
                    </div>
                )}

                {isCreator && (
                <>
                <div className="max-w-2xl mx-auto mb-6 space-y-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-100">Cover Picture</label>
                        <div className="w-full h-36 rounded-lg bg-gray-800 overflow-hidden">
                            {(coverPreview || form.coverpic) ? (
                                <img
                                    src={coverPreview || form.coverpic}
                                    alt="Cover preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-sm text-gray-300">
                                    Cover image preview
                                </div>
                            )}
                        </div>
                        <div className="mt-3">
                            <label
                                htmlFor="coverUpload"
                                className="inline-flex items-center px-4 py-2 text-sm rounded-lg bg-lime-400 text-black font-medium hover:bg-lime-500 cursor-pointer"
                            >
                                {uploading.cover ? "Uploading..." : "Upload Cover"}
                            </label>
                            <input
                                id="coverUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleCoverSelect}
                                className="hidden"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-100">Profile Picture</label>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full border-2 border-gray-700 bg-gray-900 overflow-hidden">
                                {(profilePreview || form.profilepic) ? (
                                    <img
                                        src={profilePreview || form.profilepic}
                                        alt="Profile preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">
                                        Profile
                                    </div>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="profileUpload"
                                    className="inline-flex items-center px-4 py-2 text-sm rounded-lg bg-lime-400 text-black font-medium hover:bg-lime-500 cursor-pointer"
                                >
                                    {uploading.profile ? "Uploading..." : "Upload Profile"}
                                </label>
                                <input
                                    id="profileUpload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfileSelect}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto mb-8 border border-gray-800 rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4">Upload a Video</h2>

                    <div className="space-y-3">
                        <input
                            type="text"
                            name="title"
                            value={videoForm.title}
                            onChange={handleVideoFormChange}
                            placeholder="Video title"
                            className="w-full p-2 rounded-lg bg-gray-800 text-white text-sm"
                        />
                        <textarea
                            name="description"
                            value={videoForm.description}
                            onChange={handleVideoFormChange}
                            placeholder="Video description"
                            className="w-full p-2 rounded-lg bg-gray-800 text-white text-sm"
                            rows={3}
                        />
                        <input
                            type="number"
                            name="price"
                            value={videoForm.price}
                            onChange={handleVideoFormChange}
                            placeholder="Price (INR)"
                            className="w-full p-2 rounded-lg bg-gray-800 text-white text-sm"
                        />
                    </div>

                    <div className="mt-4">
                        <label
                            htmlFor="videoUpload"
                            className="inline-flex items-center px-4 py-2 text-sm rounded-lg bg-lime-400 text-black font-medium hover:bg-lime-500 cursor-pointer"
                        >
                            Select Video
                        </label>
                        <input
                            id="videoUpload"
                            type="file"
                            accept="video/*"
                            onChange={handleVideoChange}
                            className="hidden"
                        />
                    </div>

                    {videoPreview && (
                        <div className="mt-4">
                            <video className="w-full rounded-lg" controls src={videoPreview}></video>
                        </div>
                    )}

                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={uploadVideo}
                            disabled={videoUploading}
                            className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-60"
                        >
                            {videoUploading ? "Uploading..." : "Upload Video"}
                        </button>
                    </div>

                    {videoUrl && (
                        <div className="mt-3 text-xs text-gray-300 break-all">
                            Uploaded URL: {videoUrl}
                        </div>
                    )}

                    <div className="mt-6 border-t border-gray-800 pt-4">
                        <h3 className="text-sm font-semibold mb-3">Optional Preview Video</h3>
                        <label
                            htmlFor="previewUpload"
                            className="inline-flex items-center px-4 py-2 text-sm rounded-lg bg-gray-700 text-white hover:bg-gray-600 cursor-pointer"
                        >
                            Select Preview
                        </label>
                        <input
                            id="previewUpload"
                            type="file"
                            accept="video/*"
                            onChange={handlePreviewChange}
                            className="hidden"
                        />

                        {previewVideoPreview && (
                            <div className="mt-3">
                                <video className="w-full rounded-lg" controls src={previewVideoPreview}></video>
                            </div>
                        )}

                        <div className="mt-3">
                            <button
                                type="button"
                                onClick={uploadPreviewVideo}
                                disabled={previewUploading}
                                className="px-4 py-2 text-sm rounded-lg bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-60"
                            >
                                {previewUploading ? "Uploading..." : "Upload Preview"}
                            </button>
                        </div>

                        {previewUrl && (
                            <div className="mt-3 text-xs text-gray-300 break-all">
                                Preview URL: {previewUrl}
                            </div>
                        )}
                    </div>
                </div>

                <div className="max-w-2xl mx-auto mb-8 border border-gray-800 rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4">My Uploaded Videos</h2>
                    {creatorVideos.length === 0 ? (
                        <div className="text-sm text-gray-400">You haven't uploaded any videos yet.</div>
                    ) : (
                        <div className="flex overflow-x-auto gap-4 pb-2 snap-x custom-scrollbar">
                            {creatorVideos.map(video => (
                                <div key={video._id} className="w-60 flex-shrink-0 snap-start bg-gray-900 p-3 rounded-lg border border-gray-800 flex flex-col justify-between">
                                    <div className="w-full h-32 bg-black rounded overflow-hidden relative mb-2">
                                        <video className="w-full h-full object-cover" src={video.previewUrl || video.videoUrl} preload="metadata"></video>
                                    </div>
                                    <div className="flex flex-col flex-grow justify-between">
                                        <div>
                                            <h3 className="font-bold text-lime-400 text-sm truncate">{video.title}</h3>
                                            <p className="text-[10px] text-gray-400 mt-1 line-clamp-2" title={video.description}>{video.description}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-xs font-semibold text-white border border-gray-700 px-2 py-1 rounded bg-black">₹{video.price}</span>
                                            <div className="flex gap-2">
                                                <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors">View</a>
                                                <button onClick={() => handleDeleteVideo(video._id)} className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 transition-colors">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <form className="max-w-2xl mx-auto" action={handleSubmit} >
                    

                    <div className='my-2'>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-100 dark:text-white">Name</label>
                        <input value={form.name ? form.name : ""} onChange={handleChange} type="text" name='name' id="name" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    {/* input for email */}
                    <div className="my-2">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-00 dark:text-white">Email</label>
                        <input value={form.email ? form.email : ""} onChange={handleChange} type="email" name='email' id="email" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    {/* input forusername */}
                    <div className='my-2'>
                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-100 dark:text-white">Username</label>
                        <input value={form.username ? form.username : ""} onChange={handleChange} type="text" name='username' id="username" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    {/* input razorpay id */}
                    <div className="my-2">
                        <label htmlFor="razorpayid" className="block mb-2 text-sm font-medium text-gray-100 dark:text-white">Razorpay Id</label>
                        <input value={form.razorpayid ? form.razorpayid : ""} onChange={handleChange} type="password" name='razorpayid' id="razorpayid" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    {/* input razorpay secret */}
                    <div className="my-2">
                        <label htmlFor="razorpaysecret" className="block mb-2 text-sm font-medium text-gray-100 dark:text-white">Razorpay Secret</label>
                        <input value={form.razorpaysecret ? form.razorpaysecret : ""} onChange={handleChange} type="password" name='razorpaysecret' id="razorpaysecret" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>

                    {/* Submit Button  */}
                    <div className="my-6">
                        <button type="submit" disabled={uploading.profile || uploading.cover} className="block w-full p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-blue-500 focus:ring-4 focus:outline-none dark:focus:ring-blue-800 font-medium text-sm disabled:opacity-60">Save</button>
                    </div>
                </form>
                </>
                )}


            </div>
        </>
    )
}

export default Dashboard
// import { fetchuser, updateProfile } from '@/actions/useractions'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Bounce } from 'react-toastify';