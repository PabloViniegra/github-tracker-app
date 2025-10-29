/**
 * usePaginatedRepositories Hook
 * Handles infinite scroll pagination for repositories
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Repository } from "@/lib/api";

interface UsePaginatedRepositoriesReturn {
	displayedRepositories: Repository[];
	hasMore: boolean;
	observerTarget: React.RefObject<HTMLDivElement | null>;
	resetPagination: () => void;
}

interface UsePaginatedRepositoriesOptions {
	repositories: Repository[];
	itemsPerPage?: number;
}

/**
 * Hook for paginating repositories with infinite scroll
 *
 * @param {UsePaginatedRepositoriesOptions} options - Configuration options
 * @returns {UsePaginatedRepositoriesReturn} Paginated data and observer ref
 *
 * @example
 * ```tsx
 * const { displayedRepositories, hasMore, observerTarget } = usePaginatedRepositories({
 *   repositories: filteredRepositories,
 *   itemsPerPage: 30
 * });
 * ```
 */
export function usePaginatedRepositories({
	repositories,
	itemsPerPage = 30,
}: UsePaginatedRepositoriesOptions): UsePaginatedRepositoriesReturn {
	const [page, setPage] = useState(1);
	const [displayedRepositories, setDisplayedRepositories] = useState<
		Repository[]
	>([]);
	const [hasMore, setHasMore] = useState(true);
	const observerTarget = useRef<HTMLDivElement>(null);

	// Reset pagination when source repositories change
	useEffect(() => {
		setPage(1);
		const initialRepos = repositories.slice(0, itemsPerPage);
		setDisplayedRepositories(initialRepos);
		setHasMore(repositories.length > itemsPerPage);
	}, [repositories, itemsPerPage]);

	// Load more items
	const loadMore = useCallback(() => {
		const nextPage = page + 1;
		const startIndex = 0;
		const endIndex = nextPage * itemsPerPage;

		setDisplayedRepositories(repositories.slice(startIndex, endIndex));
		setPage(nextPage);
		setHasMore(endIndex < repositories.length);
	}, [page, repositories, itemsPerPage]);

	// Intersection Observer for infinite scroll
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (
					entries[0].isIntersecting &&
					hasMore &&
					displayedRepositories.length > 0
				) {
					loadMore();
				}
			},
			{ threshold: 0.1 },
		);

		const currentTarget = observerTarget.current;
		if (currentTarget) {
			observer.observe(currentTarget);
		}

		return () => {
			if (currentTarget) {
				observer.unobserve(currentTarget);
			}
		};
	}, [hasMore, loadMore, displayedRepositories.length]);

	const resetPagination = useCallback(() => {
		setPage(1);
		setDisplayedRepositories(repositories.slice(0, itemsPerPage));
		setHasMore(repositories.length > itemsPerPage);
	}, [repositories, itemsPerPage]);

	return {
		displayedRepositories,
		hasMore,
		observerTarget,
		resetPagination,
	};
}
