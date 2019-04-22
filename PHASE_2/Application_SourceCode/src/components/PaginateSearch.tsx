import React from 'react';
import '../css/Search.css';
import { Pagination } from 'react-bootstrap';
import { isNull } from 'util';
import animateScrollTo from 'animated-scroll-to';

const pageDisplayLimit: number = 5;
const pageMargin: number = Math.floor(pageDisplayLimit/2);

export default class PaginateSearch extends React.Component<IPaginateSearchProps, IPaginateSearchState> {
    constructor(props: IPaginateSearchProps) {
        super(props);
    }

    private calculateTotalPages() {
        let totalPages: number = 0;
        if (!isNull(this.props.articleCount) && this.props.articleCount != 0) {
            totalPages = Math.ceil(this.props.articleCount/this.props.showCount);
        }
        return totalPages;
    }

    private createPageItems(totalPages: number) {
        let count, last;
        if (this.props.currentPage <= pageMargin) {
            count = 1;
            last = pageDisplayLimit;
        } else if (this.props.currentPage + pageMargin > totalPages) {
            count = totalPages - pageDisplayLimit;
            last = totalPages;
        } else {
            count = this.props.currentPage - pageMargin;
            last = this.props.currentPage + pageMargin;
        }

        if (count < 0) count = 1;
        if (last > totalPages) last = totalPages;

        let pageNums: Array<number> = [];
        for (let i = count; i <= last; i++) pageNums.push(i);

        let active: boolean = false;
        return pageNums.map((pageNum: number) => {
            active = (pageNum == this.props.currentPage);
            return <Pagination.Item onClick={() => this.changePage(pageNum)} active={active}>{pageNum}</Pagination.Item>;
        });
    }

    private changePage(newPage: number) {
        if (newPage != this.props.currentPage) {
            this.props.updatePaginate({currentPage: newPage});
            animateScrollTo(0);
        }
    }

    private showPagination() {
        if (!isNull(this.props.articleCount)) {
            let totalPages: number = this.calculateTotalPages();
            if (totalPages != 0) {
                let disableFirst: boolean = (this.props.currentPage == 1);
                let disableLast: boolean = (this.props.currentPage == totalPages);

                return (
                    <Pagination>
                        <Pagination.First onClick={() => this.changePage(1)} disabled={disableFirst}/>
                        <Pagination.Prev onClick={() => this.changePage(this.props.currentPage - 1)} disabled={disableFirst}/>
                        { this.createPageItems(totalPages) }
                        <Pagination.Next onClick={() => this.changePage(this.props.currentPage + 1)} disabled={disableLast}/>
                        <Pagination.Last onClick={() => this.changePage(totalPages)} disabled={disableLast}/>
                    </Pagination>
                )
            }
        }
    }

    render() {
        return (
        <div className="pagination">
            {this.showPagination()}
        </div>
        );
    }
}

interface IPaginateSearchProps {
    currentPage: number;
    articleCount: number | null;
    showCount: number;
    updatePaginate: (e: object) => void;
}

interface IPaginateSearchState {

}