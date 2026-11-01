import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="section page-head">
      <div className="frame frame--text">
        <h1>페이지를 찾을 수 없습니다</h1>
        <p className="lede">주소가 바뀌었거나 삭제된 페이지입니다.</p>
        <Link className="button" href="/deals">
          할인코드 보러 가기
        </Link>
      </div>
    </section>
  )
}
