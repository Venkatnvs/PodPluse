import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import Layout from './Layout'
import { loginUser } from '../../store/actions/authActions'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    setLoading(true)
    e.preventDefault()
    if (!email || !password) {
      alert('Please fill in all fields')
      setLoading(false)
      return
    }
    const formData = {
      'email': email,
      'password': password
    }
    const res =  await dispatch(loginUser(formData))
    console.log(res)
    setLoading(false)
    navigate('/')
  }

  return (
    <Layout>
      <Card className="bg-black-2 text-white-1 w-full sm:w-[450px] shadow-lg border-0 rounded">
        <CardHeader className="items-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription className="text-sm">Enter your credentials to login</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input 
                  type="email" 
                  id="email" 
                  placeholder="Your email" 
                  className="py-2 px-3 rounded border border-black" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input 
                  type="password" 
                  id="password" 
                  placeholder="Your password" 
                  className="py-2 px-3 rounded border border-black" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            className="bg-orange-1 py-2 px-4 rounded hover:bg-orange-800 focus:outline-none focus:bg-orange-800"
            onClick={handleLogin}
          >
            Login
          </Button>
        </CardFooter>
      </Card>
    </Layout>
  )
}

export default Login