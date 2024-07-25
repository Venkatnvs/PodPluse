import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import Layout from './Layout'
import { loginUser } from '../../store/actions/authActions'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import MainLogo from './MainLogo'
import { useToast } from "@/components/ui/use-toast"


const Login = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = async (e) => {
    setLoading(true)
    e.preventDefault()
    if (!formData.email || !formData.password) {
      toast({
        variant: "destructive",
        description: "Please fill all the fields",
        title: "Login Failed",
      })
      setLoading(false)
      return
    }
    const res =  await dispatch(loginUser(formData));
    if (res.status === 200 || res.status === 201) {
      setLoading(false)
      console.log(res)
      toast({
        description: "Logged in successfully",
        title: "Welcome :) back, " + res?.data?.full_name,
      })
      navigate('/')
    }else{
      setLoading(false)
      toast({
        variant: "destructive",
        description: res?.response?.data?.non_field_errors || res?.response?.data?.detail || "Something went wrong",
        title: "Login Failed",
      })
    }
  }

  return (
    <Layout>
      <Card className="bg-black-2 text-white-1 w-full sm:w-[450px] shadow-lg border-0 rounded">
        <CardHeader className="items-center">
          <MainLogo />
          <CardTitle className="text-xl font-bold">Login In</CardTitle>
          <CardDescription className="text-sm">Welcome back! Please Login to continue</CardDescription>
        </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email:</Label>
                <Input 
                  type="email" 
                  id="email" 
                  placeholder="Your email" 
                  className="py-2 px-3 rounded border-0 bg-black-1" 
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleFormChange(e)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">Password:</Label>
                <Input 
                  type="password" 
                  id="password" 
                  placeholder="Your password" 
                  className="py-2 px-3 rounded border-0 bg-black-1" 
                  name="password"
                  value={formData.password}
                  onChange={(e) => handleFormChange(e)}
                  required
                />
              </div>
            </div>
        </CardContent>
        <CardFooter className="flex justify-center flex-col">
          <Button 
            className="bg-orange-1 mt-2 py-2 px-4 rounded w-full flex hover:bg-orange-800 focus:outline-none focus:bg-orange-800"
            type="submit"
            >
            {
              loading ? 'Loading...' : 'Login'
              }
          </Button>
          <div className='mt-2'>
            <p className="text-sm mt-2">{"Don't have an account"}?&nbsp;
              <Link to="/register" className="text-orange-500 hover:underline">Register</Link>
            </p>
          </div>
        </CardFooter>
            </form>
      </Card>
    </Layout>
  )
}

export default Login