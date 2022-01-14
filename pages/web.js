// React imports
import React from 'react'

// component imports
import BulletinRow from '../components/bulletinRow'
import Logo from '../components/logo'
import Footer from '../components/footer'


class webApp extends React.Component{
    constructor(props){
        super(props)
        this.state={
            screen: "hot",
        }

        this.toggleBulletinView = this.toggleBulletinView.bind(this)
        this.toggleCardsView = this.toggleCardsView.bind(this)
        this.toggleHotView = this.toggleHotView.bind(this)
    }

    toggleHotView(){
        this.setState({screen: "hot"})
    }

    toggleBulletinView(){
        this.setState({screen: "bulletin"})
    }

    toggleCardsView(){
        this.setState({screen: "cards"})
    }

    render(){
        const {screen} = this.state
        if(this.props.auth ?? true){  // login success: enter (remove ?? true for prod)
            return(
                <>
                    <div id="pageWrapper" className="grid grid-cols-6 grid-rows-6 gap-x-5 gap-y-2 p-5 font-dongji h-screen">
                        <div id="summary" className="col-span-1 col-start-1 row-span-1 row-start-1 bg-gradient-to-r from-violet-500 to-indigo-500 text-center flex justify-center items-center rounded-lg ">
                            <h1 className="text-3xl text-white">Richardson, TX</h1>
                        </div>

                        <div id="leftPanel" className="bg-violet-300 col-span-1 col-start-1 row-start-2 row-span-2 flex flex-col items-center rounded-lg shadow-lg">
                            <button className="px-5 py-8 border-b-2 border-white w-full h-1/4 duration-200 hover:bg-violet-100 rounded-t-lg flex justify-center items-center text-base" onClick={this.toggleHotView}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                                </svg>

                                <h1 className="ml-2">Hot Topics</h1>
                            </button>

                            <button className="px-5 py-8 border-b-2 border-white w-full h-1/4 duration-200 hover:bg-violet-100 flex justify-center items-center" onClick={this.toggleBulletinView}>                        
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>

                                <h1 className="ml-2">Bulletin Board</h1>
                            </button>

                            <button className="px-5 py-8 border-b-2 border-white w-full h-1/4 duration-200 hover:bg-violet-100 flex justify-center items-center" onClick={this.toggleCardsView}>                        
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>

                                <h1 className="ml-2">Candidate Cards</h1>
                            </button>


                            <div className="h-full flex flex-col-reverse pl-3 pt-3 pb-3 pr-1 text-center">
                                <div className="flex justify-center items-center">
                                    <Logo />
                                    <h1 className="text-2xl">｜</h1>
                                    <h2 className="ml-2">V. 1.0.1</h2>
                                </div>
                                
                            </div>
                        </div>

                        <div id="rightPanel" className="bg-slate-100 rounded-lg shadow col-span-5 col-start-2 row-span-full flex flex-col items-center p-5">
                            { screen==="bulletin" ? (
                                <div>
                                    <h1 className="text-slate-600 text-4xl font-bold mt-3">Community Bulletin</h1>
                                </div>
                            ) : screen==="hot" ? (
                                <div>
                                    <h1 className="text-slate-600 text-4xl font-bold mt-3">Hot and Trending</h1>
                                </div>
                            ) : screen==="cards" ? (
                                <div>
                                    <h1 className="text-slate-600 text-4xl font-bold mt-3">Candidate Info Cards</h1>
                                </div>
                            ) : (
                                <p>404 Page Not Found</p>
                            )}
                        </div>
                    </div>
                    
                    <Footer />
                    
                </>
            )
        }else{  // login failed: do not open webapp
            return(
                <>
                    <p>Error: Not Authorized - Please Sign In</p>
                </>
            )
        }
    }
}

export default webApp