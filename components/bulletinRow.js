import React from 'react'

class BulletinRow extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            upVotes: 0,
            downVotes: 0,
            selected: [false, false],
        }

        this.toggleMap = this.toggleMap.bind(this)
        this.handleDown = this.handleDown.bind(this)
        this.handleUp = this.handleUp.bind(this)
    }

    componentDidMount(){
        this.setState({upVotes: this.props.up, downVotes: this.props.down})
    }

    toggleMap(){
        let el = document.getElementById('map')
        let mapClassList = el.classList
        if(mapClassList.contains('hidden')){
            mapClassList.remove('hidden')
        }else{
            mapClassList.add('hidden')
        }
    }

    handleUp(e){
        let el = e.currentTarget  // button

        if(this.state.selected[0]){  // undo the upvote
            this.setState({upVotes: this.state.upVotes-1, selected: [false, false]})
            el.classList.add("bg-emerald-100")
            el.classList.remove("bg-slate-200")
        }else{  // do the upvote
            if(this.state.selected[1]){  // upvote from downvote
                let el1 = document.getElementById('downBtn')
                this.setState({upVotes: this.state.upVotes+=1})
                el1.classList.add("bg-red-100")
                el1.classList.remove("bg-slate-200")
            }
            this.setState({upVotes: this.state.upVotes+1, selected: [true,false]})
            el.classList.remove("bg-emerald-100")
            el.classList.add("bg-slate-200")
        }

        
    }

    handleDown(e){
        let el = e.currentTarget  // button

        if(this.state.selected[1]){  // undo the downvote
            this.setState({upVotes: this.state.upVotes+1, selected: [false, false]})
            el.classList.add("bg-red-100")
            el.classList.remove("bg-slate-200")
        }else{  // do the downvote
            if(this.state.selected[0]){ // downvote from upvote
                let el1 = document.getElementById('upBtn')
                this.setState({upVotes: this.state.upVotes-=1})
                el1.classList.add("bg-emerald-100")
                el1.classList.remove("bg-slate-200")
            }
            this.setState({upVotes: this.state.upVotes-1, selected: [false, true]})
            el.classList.remove("bg-red-100")
            el.classList.add("bg-slate-200")
        }
        
    }

    render(){
        const upvotes = this.state.upVotes
        return (
            <>
                <details className="mt-5 w-4/5 text-center bg-white open:ring-1 open:ring-black/5 p-6 rounded-lg" closed>
                    <summary name="summary" className="text-sm leading-6 text-slate-600 font-semibold select-none">
                        <span name="eventCount" className="font-bold text-emerald-500">{upvotes}</span> {this.props.statement}
                    </summary>
                    <div className="mt-3 flex flex-col items-center justify-center text-sm leading-6 text-slate-500">
                        <div name="bulletinText" class="mb-3 leading-loose">
                            {this.props.quotes.map((quote) => (
                                <p>{quote}</p>
                            ))}
                        </div>
                        
                        <div name="bulletinButtons" class="flex items-center justify-center">
                            <button className="mt-2 rounded-lg shadow px-2 py-1 hover:bg-sky-100 mx-1" onClick={this.toggleMap}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                            </button>

                            <button id="upBtn" className="mt-2 rounded-lg shadow px-2 py-1 bg-emerald-100 hover:bg-sky-100 mx-1" onClick={this.handleUp}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                            </button>

                            <button id="downBtn" className="mt-2 rounded-lg shadow px-2 py-1 bg-red-100 hover:bg-sky-100 mx-1" onClick={this.handleDown}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                </svg>
                            </button>    
                        </div>
                        
                        <iframe id="map" name="map" width="450" height="300" className="hidden mt-2 rounded border-2 border-violet-300" loading="lazy" allowFullScreen src="https://www.google.com/maps/embed/v1/place?q=%2033%C2%B006'06.4%22N%2096%C2%B040'28.2%22W%20&key=AIzaSyBPyTRO8tcnYubJZiEnyZOCgmIoxPuFNYo"></iframe>
                    </div>
                </details>
            </>
        )
    }
}

export default BulletinRow