import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { getPrismicClient } from '../../services/prismic'

const post = {
  slug: 'my-new-post',
  title: 'My new post',
  content: '<p>Post content</p>',
  updatedAt: '24 de Dezembro'
}

jest.mock('next-auth/client')
jest.mock('next/router')
jest.mock('../../services/prismic')

describe('Post preview page', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<Post post={post} />)

    expect(screen.getByText('My new post')).toBeInTheDocument()
    expect(screen.getByText('Post content')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('redirects user to full post when user is subscribed', async () => {
    const useSessionMocked = mocked(useSession)
    const useRouterMocked = mocked(useRouter)
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: 'fake-active-subscription' },
      false,
    ] as any)

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any)

    render(<Post post={post} />)

    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')
  })

  // it('loads initial data', async () => {
  //   const getSessionMocked = mocked(getSession)
  //   const getPrismicClientMocked = mocked(getPrismicClient)

  //   getSessionMocked.mockResolvedValueOnce({
  //     activeSubscription: 'fake-active-subscription',
  //   } as any)

  //   getPrismicClientMocked.mockReturnValueOnce({
  //     getByUID: jest.fn().mockResolvedValue({
  //       data: {
  //         title: [
  //           { type: 'heading', text: 'My new post' }
  //         ],
  //         content: [
  //           { type: 'paragraph', text: 'Post content' }
  //         ],
  //       },
  //       last_publication_date: '12-26-2021',
  //     })
  //   } as any)

  //   const response = await getServerSideProps({
  //     params: { slug: 'my-new-post' }
  //   } as any)

  //   expect(response).toEqual(
  //     expect.objectContaining({
  //       props: {
  //         post: {
  //           slug: 'my-new-post',
  //           title: 'My new post',
  //           content: '<p>Post content</p>',
  //           updatedAt: '26 de dezembro de 2021',
  //         }
  //       }
  //     })
  //   )
  // })
})
