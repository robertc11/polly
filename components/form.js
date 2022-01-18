import BlockX from './blockX'
import Link from 'next/link'

export default function Form({ errorMessage, onSubmit }) {
  return (
    <BlockX>
      <form onSubmit={onSubmit} className="w-full flex flex-col items-center justify-center p-5 font-dongji text-xl text-slate-600">
        <h1></h1>
        <label className="flex flex-col items-center justify-center mb-5">
          <span className="mb-2 font-medium">Username/Email</span>
          <input className={ errorMessage==="" ? "border-2 border-slate-500 rounded" : "border-2 border-rose-500 rounded"} type="text" name="username" required />
        </label>

        <label className="flex flex-col items-center justify-center mb-5">
          <span className="mb-2 font-medium">Password</span>
          <input className={ errorMessage==="" ? "border-2 border-slate-500 rounded" : "border-2 border-rose-500 rounded"} type="password" name="password" required />
        </label>

        <button className="duration-200 bg-emerald-400 text-white py-1 px-3 border-2 border-emerald-400 rounded-lg hover:bg-white hover:text-black hover:border-2 hover:border-black" type="submit">Login</button>

        {errorMessage && <p className="error mt-5 text-rose-500 font-bold">{errorMessage}</p>}

        <div className="text-center mt-3">
          <p>No Account? No Problem!</p>
          <Link href="/"><a className="text-violet-500">Create an Account</a></Link>
        </div>
        
      </form>
    </BlockX>
  )
  }