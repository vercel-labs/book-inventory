'use client';

export default function Error() {
  return (
    <div className="max-w-md p-6 mx-auto bg-white dark:bg-black border border-gray-200 rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-center text-gray-900 dark:text-gray-100">
        Database Setup Required
      </h2>
      <p className="text-gray-700">
        Your database does not have a{' '}
        <code className="p-1 font-mono text-red-600 bg-gray-200 dark:bg-gray-800 rounded">
          books
        </code>{' '}
        table. Please run the script{' '}
        <code className="p-1 font-mono text-green-600 bg-gray-200 dark:bg-gray-800 rounded">
          npm run seed
        </code>{' '}
        to create the table and seed it with data.
      </p>
    </div>
  );
}
