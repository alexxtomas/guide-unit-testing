import axios from 'axios'
import { useReducer, useState } from 'react'

const initialState = {
  error: null,
  movies: []
}

const actions = {
  SUCCESS: (payload, state) => ({
    error: null,
    movies: [...state.movies, ...payload]
  }),
  ERROR: (payload) => ({
    error: payload,
    movies: []
  }),
  ADD_MOVIE: (payload, state) => ({
    error: null,
    movies: state.movies.concat(payload)
  }),
  DEFAULT: (state) => state
}

function isAValidAction(actions, actionType) {
  return Object.keys(actions).find((a) => a === actionType) !== undefined
}

function moviesReducer(state, action) {
  if (!isAValidAction(actions, action.type)) {
    return actions.DEFAULT(state)
  }

  return actions[action.type](action.payload, state)
}

export default function Movies({ url }) {
  const [{ error, movies }, dispatch] = useReducer(moviesReducer, initialState)
  const [buttonClicked, setButtonClicked] = useState(false)

  const fetchGreeting = async (url) =>
    axios
      .get(url)
      .then((response) => {
        const { data: movies } = response
        dispatch({ type: 'SUCCESS', payload: movies })
        setButtonClicked(true)
      })
      .catch((error) => {
        dispatch({ type: 'ERROR', payload: error })
      })

  const buttonText = 'Load Movies'

  return (
    <div>
      <button onClick={() => fetchGreeting(url)} disabled={buttonClicked}>
        {buttonText}
      </button>
      <ul>
        {movies.length > 0 &&
          movies.map((movie) => {
            return (
              <li key={movie.id}>
                <h3>{movie.title}</h3>
                <p>
                  <span>Critics Consensus:</span> {movie.criticsConsensus}
                </p>
                <p>
                  <span>Directed By:</span> {movie.criticsConsensus}
                </p>
              </li>
            )
          })}
      </ul>
      {error && <p role="alert">Oops, failed to fetch!</p>}
      {buttonClicked && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const newMovie = {
              id: crypto.randomUUID(),
              title: e.target.title.value,
              criticsConsensus: e.target.criticsConsensus.value,
              directedBy: e.target.directedBy.value
            }
            axios
              .post(url, newMovie)
              .then(({ data: addedMovie }) => {
                dispatch({ type: 'ADD_MOVIE', payload: addedMovie })
              })
              .catch((e) => dispatch({ type: 'ERROR', payload: e }))

            e.target.title.value = ''
            e.target.criticsConsensus.value = ''
            e.target.directedBy.value = ''
          }}
        >
          <label>
            Title:{' '}
            <input type="text" name="title" placeholder="TILL" required />
          </label>
          <label htmlFor="criticsConsensus"> Critics Consensus:</label>
          <textarea
            id="criticsConsensus"
            placeholder="Till reframes an historically horrific murder within a..."
            name="criticsConsensus"
          ></textarea>

          <label>
            Directed By:{' '}
            <input
              type="text"
              name="directedBy"
              placeholder="Chinonye Chukwu"
              required
            />
          </label>
          <button className="submit-button">Create</button>
        </form>
      )}
    </div>
  )
}
