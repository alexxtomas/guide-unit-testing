import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest'
import Movies from '../Movies'
const server = setupServer(
  rest.get('/movies', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: '1',
          title: 'THE QUIET GIRL',
          criticsConsensus:
            'A remarkable debut for writer-director Colm Bairéad, The Quiet Girl offers a deceptively simple reminder that the smallest stories can leave a large emotional impact.',
          DirectedBy: 'Colm Bairead'
        },
        {
          id: '2',
          title: 'HAPPENING',
          criticsConsensus:
            'A tough but rewarding watch, Happening puts a personal face on an impossibly difficult choice and its heart-rending aftermath.',
          DirectedBy: 'Audrey Diwan'
        }
      ])
    )
  })
)

beforeAll(() => server.listen())
beforeEach(() => render(<Movies url="/movies" />))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('loads and displays movies', async () => {
  fireEvent.click(screen.getByText('Load Movies'))

  await waitFor(() => screen.getAllByRole('listitem'))

  expect(screen.getAllByRole('listitem')).toBeDefined()
  expect(screen.getAllByRole('listitem')).toHaveLength(2)
  expect(screen.getByText('Load Movies')).toBeDisabled()
})

// test('can add a move', async () => {
//   server.use(
//     rest.post('/movies', (req, res, ctx) => {
//       return res(ctx.json(
//         {
//           req
//         }
//       ))
//     })
//   )
// })

test('handles server error', async () => {
  server.use(
    rest.get('/movies', (req, res, ctx) => {
      return res(ctx.status(500))
    })
  )
  fireEvent.click(screen.getByText('Load Movies'))

  await waitFor(() => screen.getByRole('alert'))

  expect(screen.getByRole('alert')).toHaveTextContent('Oops, failed to fetch!')
  expect(screen.getByRole('button')).not.toBeDisabled()
})
