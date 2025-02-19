import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Search } from 'lucide-react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import { IconButton } from './icon-button'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { TableCell } from './table/table-cell'
import { TableRow } from './table/table-row'
import { ChangeEvent, useEffect, useState } from 'react'


dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface Attendee {
    id: string
    name: string
    email: string
    createdAt: string
    checkedInAt: string | null
}

export function AttendeeList() {
    const [search, setSearch] = useState(() => {
        const url = new URL(window.location.toString())

        if (url.searchParams.has('page')) {
            return url.searchParams.get('search') ?? ''
        }

        return ''

    })
    const [page, setPage] = useState(() => {
        const url = new URL(window.location.toString())

        if (url.searchParams.has('page')) {
            return Number(url.searchParams.get('page'))
        }

        return 1
    })
    const [attendees, setAttendees] = useState<Attendee[]>([])
    const [total, setTotal] = useState(0)

    const totalPages = Math.ceil(total / 10)

    useEffect(() => {
        const url = new URL('http://localhost:3333/events/0e1aad23-21e0-477b-953a-27fb8a82a19a/attendees')
        url.searchParams.set('pageIndex', String(page - 1))

        if (search.length > 0) {
            url.searchParams.set('query', search)
        }


        fetch(url)
            .then(response => response.json())
            .then(data => {
                setAttendees(data.attendees)
                setTotal(data.total)
            })
    }, [page, search])

    function setCurrentPage(page: number) {
        const url = new URL(window.location.toString())
        url.searchParams.set('page', String(page))
        window.history.pushState({}, "", url)
        setPage(page)
    }

    function setCurrentSearch(search: string) {
        const url = new URL(window.location.toString())
        url.searchParams.set('search', search)
        window.history.pushState({}, "", url)
        setSearch(search)
    }

    function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
        setCurrentSearch(event.target.value)
        setCurrentPage(1)
    }

    function goToNextPage() {
        setCurrentPage(page + 1)
    }

    function goToPreviusPage() {
        setCurrentPage(page - 1)
    }

    function goToFirstPage() {
        setCurrentPage(1)
    }

    function goToLastPage() {
        setCurrentPage(totalPages)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
                <h1 className="text-2xl font-bold">Participantes</h1>
                <div className="px-3 w-72 py-1.5 border border-white/10 rounded-lg text-sm flex items-center gap-3">
                    <Search className="size-4" />
                    <input value={search} onChange={onSearchInputChanged} className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0" placeholder="Buscar partipante..." />
                </div>
            </div>
            <Table>
                <thead>
                    <TableRow className="border-b border-white/10">
                        <TableHeader style={{ width: 48 }}>
                            <input className="size-4 bg-black/20 rounded border border-white/10" type="checkbox" />
                        </TableHeader>
                        <TableHeader>
                            Código
                        </TableHeader>
                        <TableHeader>
                            Participante
                        </TableHeader>
                        <TableHeader>
                            Data da inscrição
                        </TableHeader>
                        <TableHeader>
                            Data da check-in
                        </TableHeader>
                        <TableHeader style={{ width: 64 }}></TableHeader>
                    </TableRow>
                </thead>
                <tbody>
                    {attendees.map((attendee) => {
                        return (
                            <TableRow key={attendee.id}>
                                <TableHeader>
                                    <input className="size-4 bg-black/20 rounded border border-white/10" type="checkbox" />
                                </TableHeader>
                                <TableHeader>
                                    {attendee.id}
                                </TableHeader>
                                <TableHeader>
                                    <div className="flex flex-col gap-1 ">
                                        <span className="font-semibold text-white">
                                            {attendee.name}
                                        </span>
                                        <span>
                                            {attendee.email}
                                        </span>
                                    </div>
                                </TableHeader>
                                <TableHeader>{dayjs().to(attendee.createdAt)}</TableHeader>
                                <TableHeader>
                                    {
                                        attendee.checkedInAt === null
                                            ? <span className="text-zinc-400">Não fez check in</span>
                                            : dayjs().to(attendee.checkedInAt)
                                    }
                                </TableHeader>
                                <TableHeader>
                                    <IconButton className="bg-black/20 border border-white/20 rounded-md p-1.5" transparent>
                                        <MoreHorizontal className="size-4" />
                                    </IconButton>
                                </TableHeader>
                            </TableRow>
                        )
                    })}
                </tbody>
                <tfoot>
                    <TableRow className="border-b border-white/10">
                        <TableCell colSpan={3}>
                            Mostrando {attendees.length} de {total}
                        </TableCell>
                        <TableCell className="text-right" colSpan={3}>
                            <div className="inline-flex items-center gap-8 ">
                                <span>Página {page} de {totalPages}</span>

                                <div className="flex gap-1.5">
                                    <IconButton onClick={goToFirstPage} disabled={page === 1}>
                                        <ChevronsLeft className="size-4" />
                                    </IconButton>
                                    <IconButton onClick={goToPreviusPage} disabled={page === 1}>
                                        <ChevronLeft className="size-4" />
                                    </IconButton>
                                    <IconButton onClick={goToNextPage} disabled={page === totalPages}>
                                        <ChevronRight className="size-4" />
                                    </IconButton>
                                    <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                                        <ChevronsRight className="size-4" />
                                    </IconButton>
                                </div>
                            </div>
                        </TableCell>
                    </TableRow>
                </tfoot>
            </Table>
        </div>
    )
}