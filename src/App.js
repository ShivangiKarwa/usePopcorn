import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useKey } from "./useKey";
// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = 'aca438d3'
//const tempQuery = 'interstellar'

export default function App() {

  // const [movies, setMovies] = useState([]);
  // const [isLoading, setIsLoading] = useState(false)
  // const [error, setError] = useState('')
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null)

  const [movies, isLoading, error] = useMovies(query, handleClosedMovie)
  
  //const [watched, setWatched] = useState([]); 
  const [watched, setWatched] = useState(function(){
    const stored = localStorage.getItem('watched')
    return JSON.parse(stored)
  }); 
  



  // useEffect(function () {
    
  //   const controller = new AbortController();

  //   async function fetchMovies(){

  //     try{
  //     setIsLoading(true)
  //     setError('')
  //    const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query.toLowerCase()}`, {signal: controller.signal})
  //    if (!res.ok) throw new Error("Something went wrong with fetching movies")
  //    const data = await res.json()
  //   if(data.Response === "False"){
  //     throw new Error(data.Error)
  //   }
  //   setMovies(data.Search)
  //   //console.log(movies)
  //   setIsLoading(false)
  //     } catch(err){
  //       //console.log(err)
  //       if(err.name !== 'AbortError'){
  //         setError(err.message)
  //       }
  //     } finally {
  //       setIsLoading(false)
  //       setError('')
        
  //     }
  //   }
  //   if(query.length < 3){
  //     setMovies([])
  //     setError('')
  //     return
  //   }
  //   handleClosedMovie()
  //   fetchMovies();

  //   return function() {
  //     controller.abort();
  //   };

  // }, [query] )

  

  function handleSelectedId(id) {

    setSelectedId(selectId => selectId === id ? null: id)
  }

  function handleClosedMovie() {
    setSelectedId(null)
  }

  function handleAddWatched(movie, rating){

    const newMovie = {...movie, userRating : rating}
    setWatched((movies) => [...movies, newMovie])
    handleClosedMovie()
    // localStorage.setItem('watched', JSON.stringify([...watched, newMovie]))
  }

  function handleDeleteWatched(id){

    setWatched(watched => watched.filter((movie) => movie.imdbID !== id))

  }

  useEffect(function () {
    localStorage.setItem('watched', JSON.stringify(watched))
  }, [watched])

  return (
    <>
      
      <NavBar>
        <Logo/>
        <Search query ={query} setQuery = {setQuery}/>
        <SearchResults movies = {movies}/>
      </NavBar>
      <Main>
        {/* <Box element = {<MoviesList movies={movies}/> }/>
        <Box element={<><Summary watched = {watched} /><WatchedList watched = {watched}/></>}/> */}
        <Box>
          {error ? <ErrorMsg errMess = {error}/> :  isLoading ? <Loader/> : <MoviesList movies={movies} handleSelectedId = {handleSelectedId}/> }
        </Box> 
         <Box>
       { selectedId ? <SelectedMovie selectedId={selectedId} handleClosedMovie={handleClosedMovie} onAddWatched = {handleAddWatched} watched = {watched}/> : <>
       <Summary watched = {watched} />
        <WatchedList watched = {watched} handleDeleteWatched = {handleDeleteWatched}/> </>}
        </Box>
      </Main>
      
    </>
  );
}

function Loader(){
  return <p className="loader">Loading...</p>
}

function ErrorMsg({errMess}){
  return <p className="error">⛔️ {errMess}</p>
}

function NavBar({children}) {
  return (<nav className="nav-bar">
        {children}
      </nav>)

}

function Search({query, setQuery}){

  // useEffect(function() {
  //   const el = document.querySelector('.search')
  //   el.focus()
  // }, [])

  const inputEle = useRef(null)

   useEffect(function() {
    document.addEventListener('keydown', function(e){
      if(document.activeElement === inputEle.current) return
      if(e.code === 'Enter'){
        inputEle.current.focus()
        setQuery("")
      }
    })

    
  }, [setQuery])

 

  
  return (

    <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    ref = {inputEle}
  />

  )
}

function Logo() {

  return (
        <div className="logo">
          <span role="img">🍿</span>
          <h1>usePopcorn</h1>
        </div>
      )
}

function SearchResults({movies}) {
  return (
    <p className="num-results">
          Found <strong>{movies.length}</strong> results
    </p>
  )
}

function Main({children}) {
 
  return (

    <main className="main">
        
       {children}
        
      </main>

  );
}

function Box({children}){

  const [isOpen, setIsOpen] = useState(true);

  return <div className="box">
  <button
    className="btn-toggle"
    onClick={() => setIsOpen((open) => !open)}
  >
    {isOpen ? "–" : "+"}
  </button>
  {isOpen && ( children
   
  )}
</div>

}


// function ListBox({children}) {

//   const [isOpen1, setIsOpen1] = useState(true);


//  return <div className="box">
//           <button
//             className="btn-toggle"
//             onClick={() => setIsOpen1((open) => !open)}
//           >
//             {isOpen1 ? "–" : "+"}
//           </button>
//           {isOpen1 && ( children
           
//           )}
//         </div>

// }

// function WatchedBox() {

  
//   const [isOpen2, setIsOpen2] = useState(true);
//   const [watched, setWatched] = useState(tempWatchedData); 
 


//   return <div className="box">
//           <button
//             className="btn-toggle"
//             onClick={() => setIsOpen2((open) => !open)}
//           >
//             {isOpen2 ? "–" : "+"}
//           </button>
//           {isOpen2 && (
//             <>
              
//               <Summary watched = {watched} />
//               <WatchedList watched = {watched}/>

              
//             </>
//           )}
//         </div>

// }

function MoviesList({movies, handleSelectedId}) {
  return <ul className="list list-movies">
  {movies?.map((movie) => (
    <Movie movie = {movie} key = {movie.imdbID} handleSelectedId={handleSelectedId}/>
  ))}
</ul>
}

function Movie({movie, handleSelectedId}){

  return <li onClick = {() => handleSelectedId(movie.imdbID)} key = {movie.imdbID}>
  <img src={movie.Poster} alt={`${movie.Title} poster`} />
  <h3>{movie.Title}</h3>
  <div>
    <p>
      <span>🗓</span>
      <span>{movie.Year}</span>
    </p>
  </div>
</li>
}

function SelectedMovie({selectedId, handleClosedMovie, onAddWatched, watched}){

  const [isLoadingSelected , setIsLoadingSelected] = useState(false)
  const [errorSelected, setErrorSelected] = useState('')
  const [selectedMovie, setSelectedMovie] = useState([])
  const [userRating, onSetUserRating] = useState('')
  //const countRef = useRef(0);

  // useEffect(function() {

  //   if(userRating) countRef.current += 1

  // }, [userRating])

  const isWatched = watched.map(movie => movie.imdbID).includes(selectedId)

  const watchedUserRating = watched.find(movie => movie.imdbID === selectedId)?.userRating


  //console.log()

  useKey('Escape',handleClosedMovie)

  // useEffect( function() {
  //   document.addEventListener('keydown', function(e){
  //     if(e.code === 'Escape'){
  //       handleClosedMovie()
  //     }
  //   })

  //   return function() {
  //     document.removeEventListener('keydown',function(e){
  //       if(e.code === 'Escape'){
  //         handleClosedMovie()
  //       }
  //     })
  //   }
  // },[handleClosedMovie])
 

  useEffect(function() {
    async function fetchSelectedMovie() {

      try{
        setIsLoadingSelected(true)
        setErrorSelected('')
       const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`)
       if (!res.ok) throw new Error("Something went wrong with fetching movie")
       const data = await res.json()
      if(data.Response === "False"){
        throw new Error(data.Error)
      }
      setSelectedMovie(data)
      //console.log(selectedMovie)
      setIsLoadingSelected(false)
        } catch(err){
          //console.log(err)
          setErrorSelected(err.message)
        } finally {
          setIsLoadingSelected(false)
          setErrorSelected('')
          
        }
    }

    fetchSelectedMovie()
    

  }, [selectedId])

  useEffect(
    function(){

      if(!selectedMovie.Title) return

      document.title = "Movie | " + selectedMovie.Title

      return function() {
        document.title = "usePopcorn"
      }


    }, [selectedMovie.Title]
  )


  return <>
  {errorSelected ? <ErrorMsg/> : isLoadingSelected ? <Loader/> : <MovieSelected selectedMovie = {selectedMovie} handleClosedMovie = {handleClosedMovie} onAddWatched = {onAddWatched} userRating = {userRating} onSetUserRating = {onSetUserRating} isWatched = {isWatched} watchedUserRating = {watchedUserRating}/>}
  </>

    
}


function MovieSelected({selectedMovie,handleClosedMovie, onAddWatched,userRating, onSetUserRating, isWatched, watchedUserRating}){

  

  return <div className="details">
  <header>

  <button className="btn-back" onClick={handleClosedMovie}>&larr;</button>

  <img src={selectedMovie.Poster} alt = {selectedMovie.Title}/>
  <div className="details-overview">
    <h2>{selectedMovie.Title}</h2>
    <p>{selectedMovie.Released} &bull; {selectedMovie.Runtime}</p>
    <p>{selectedMovie.Genre}</p>
    <p><span>⭐️</span>{selectedMovie.imdbRating} IMDb rating</p>

  </div>

  {/* {errorSelected ? <ErrorMsg/> : isLoadingSelected ? <Loader/> : <MovieSelected selectedMovie={selectedMovie}/>} */}

  </header>
  <section>
    <div className="rating">
     { ! isWatched ? <> <StarRating size={40} onSetRating = {onSetUserRating}/>
    {userRating > 0 && <button className="btn-add" onClick = {() => onAddWatched(selectedMovie, userRating)}>+ Add to List</button>}</>
: `You rated the movie ${watchedUserRating} ⭐️`}
    </div>
    <p><em>{selectedMovie.Plot}</em></p>
    <p>Starring {selectedMovie.Actors}</p>
    <p>Directed by {selectedMovie.Director}</p>
  </section>
</div>

}

function Summary({watched}) {

  

  const avgImdbRating = average(watched.map((movie) => Number(movie.imdbRating)));
  const avgUserRating = average(watched.map((movie) => Number(movie.userRating)));
  const avgRuntime = average(watched.map((movie) => movie.Runtime ? Number(movie.Runtime.split(' ')[0]) : 0));

  return (
    <div className="summary">
                <h2>Movies you watched</h2>
                <div>
                  <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                  </p>
                  <p>
                    <span>⭐️</span>
                    <span>{parseFloat(avgImdbRating).toFixed(2)}</span>
                  </p>
                  <p>
                    <span>🌟</span>
                    <span>{parseFloat(avgUserRating).toFixed(2)}</span>
                  </p>
                  <p>
                    <span>⏳</span>
                    <span>{parseFloat(avgRuntime).toFixed(2)} min</span>
                  </p>
                </div>
              </div>
  )
}

function WatchedList({watched, handleDeleteWatched}) {
  return (
    <ul className="list">
                {watched.map((movie) => (

                  <WatchedMovie movie = {movie} key={movie.imdbID} handleDeleteWatched = {handleDeleteWatched}/>
                 
                ))}
              </ul>

  )
}

function WatchedMovie({movie, handleDeleteWatched}){

  return <li>
  <img src={movie.Poster} alt={`${movie.Title} poster`} />
  <h3>{movie.Title}</h3>
  <div>
    <p>
      <span>⭐️</span>
      <span>{movie.imdbRating}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{movie.userRating}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{movie.Runtime}</span>
    </p> 
    <button className="btn-delete" onClick = {() => handleDeleteWatched(movie.imdbID)}>X</button>
  </div>
  
</li>

}



