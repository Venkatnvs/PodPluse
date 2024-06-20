import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import Layout from './Layout'
import { registerUser } from '../../store/actions/authActions'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import MainLogo from './MainLogo'
import { useToast } from '@/components/ui/use-toast'
import formatErrorMessages from '@/lib/formatErrorMessages'

const Register = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (!formData.username || !formData.email || !formData.password) {
      toast({
        variant: "destructive",
        description: "Please fill all the fields",
        title: "Error",
      })
      setLoading(false)
      return;
    }
    const res = await dispatch(registerUser(formData));
    if (res.status === 201 || res.status === 200) {
      setLoading(false)
      toast({
        variant: "success",
        description: "Account created successfully",
        title: "Success :)", 
      })
      navigate('/login')
    }else{
      setLoading(false)
      toast({
        variant: "destructive",
        description: (
          <div dangerouslySetInnerHTML={{ __html: formatErrorMessages(res?.response?.data) }} />
        ),
        title: "Error !",
        duration: 10000,
      })
    }

  }

  return (
    <Layout>
      <Card className="bg-black-2 text-white-1 w-full sm:w-[450px] shadow-lg border-0 rounded">
        <CardHeader className="items-center">
          <MainLogo />
          <CardTitle className="text-xl font-bold">Sign Up</CardTitle>
          <CardDescription className="text-sm">Welcome! Please fill details to get started</CardDescription>
        </CardHeader>
      <form onSubmit={handleRegister}>
        <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username" className="text-sm font-medium">Username:</Label>
                <Input 
                  type="text" 
                  id="username" 
                  placeholder="Your username" 
                  className="py-2 px-3 rounded border-0 bg-black-1"
                  name="username"
                  value={formData.username}
                  onChange={(e) => handleFormChange(e)}
                  
                />
              </div>
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
                  value={formData.password}
                  name="password"
                  onChange={(e) =>  handleFormChange(e)}
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
              loading ? 'Loading...' : 'Sign Up'
              }
          </Button>
          <div className='mt-2'>
            <p className="text-sm mt-2">Already have an account?&nbsp;
              <Link to="/login" className="text-orange-500 hover:underline">Login</Link>
            </p>
          </div>
        </CardFooter>
            </form>
      </Card>
    </Layout>
  )
}

export default Register;